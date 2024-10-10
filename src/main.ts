import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { BadRequestException, HttpStatus, ValidationError, ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DefaultHeadersInterceptor, SentryFilter, localization } from './common';
// import * as Sentry from '@sentry/node';

async function bootstrap() {
  const http_port = +process.env.HTTP_PORT || 3000;
  const is_development = process.env.IS_DEVELOPMENT ? process.env.IS_DEVELOPMENT.toLocaleLowerCase() === 'true' : true;
  const app = await NestFactory.create(MainModule, { cors: true });

  app.startAllMicroservices();

  // Sentry.init({
  //   dsn: process.env.SENTRY_DSN,
  //   debug: is_development,
  //   environment: is_development ? 'dev' : 'production',
  //   release: process.env.npm_package_version,
  //   tracesSampleRate: 1.0,
  //   maxBreadcrumbs: 10,
  // } as unknown);

  app.useGlobalInterceptors(new DefaultHeadersInterceptor());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        console.log(validationErrors);
        const message = [];
        new BadRequestException(
          validationErrors.map((error) => {
            const description = Object.values(error.constraints).join(', ');
            message.push({
              code: {
                enum: 'VALIDATION_ERROR',
                number: 10400,
              },
              text: {
                developer: `Value "${error.value}" not valid for "${error.property}", ${description}.`,
                client: description,
              },
            });
          }),
        );

        localization.message(message, null, true, HttpStatus.BAD_REQUEST);
      },
    }),
  );

  if (is_development) {
    const options = new DocumentBuilder()
      .setTitle('API Rate Limiting & Caching System')
      .setDescription('The API Rate Limiting & Caching System description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('doc/v1', app, document, {
      swaggerOptions: { docExpansion: 'none' },
    });
  }

  await app.listen(http_port);

  const url = await app.getUrl();

  console.log(
    '\x1b[36m%s\x1b[0m',
    `
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
╱╱                                             ╱╱
╱╱  ╭━━━╮╱╱╱╱╱╱╱╱╭╮╭━━╮╱╱╱╭╮                   ╱╱
╱╱  ┃╭━╮┃╱╱╱╱╱╱╱╱┃┃┃╭╮┃╱╱╱┃┃                   ╱╱
╱╱  ┃╰━━┳━━┳━━┳┳━╯┃┃╰╯╰┳━━┫╰━┳━┳━━┳╮╭┳┳━━┳━╮   ╱╱
╱╱  ╰━━╮┃╭╮┃┃━╋┫╭╮┃┃╭━╮┃╭╮┃╭╮┃╭┫╭╮┃╰╯┣┫╭╮┃╭╮╮  ╱╱
╱╱  ┃╰━╯┃╭╮┃┃━┫┃╰╯┃┃╰━╯┃╭╮┃┃┃┃┃┃╭╮┃┃┃┃┃╭╮┃┃┃┃  ╱╱
╱╱  ╰━━━┻╯╰┻━━┻┻━━╯╰━━━┻╯╰┻╯╰┻╯╰╯╰┻┻┻┻┻╯╰┻╯╰╯  ╱╱
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
    `,
  );

  console.log(`Application is running on: ${url}`);
  console.log(`Swagger UI is running on: ${url}/doc/v1/`);
}
bootstrap();
