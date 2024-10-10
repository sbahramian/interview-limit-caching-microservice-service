import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch(HttpException)
export class SentryFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    try {
      const context = host.switchToHttp();
      const request = context.getRequest();
      // const response = context.getResponse();

      const payload = JSON.stringify(exception?.getResponse()) || null;
      let title = null;

      if (payload) {
        try {
          const payloadObj = JSON.parse(payload);
          title = payloadObj?.meta?.message[0]?.text?.developer;
        } catch (error) {
          console.error('Error parsing payload:', error);
        }
      }

      const jwt = JSON.stringify(request?.jwt) || null;
      const body = JSON.stringify(request?.body) || null;
      const headers = request?.headers || null;
      const route = request?.url || null;
      const method = request?.method || null;
      const queryParams = request?.query || null;
      const regex = /([^/]+)\/v(\d+)\/([^/]+)/;
      const match = route.match(regex);
      let route_module = '';
      if (match) {
        route_module = match[3];
      }

      if (route_module != 'health') {
        let level: Sentry.SeverityLevel = 'debug';
        let message;

        if (exception.getStatus() >= 200 && exception.getStatus() < 400) {
          level = 'debug';
          message = title ? title : route;
        } else if (exception.getStatus() >= 400 && exception.getStatus() < 500) {
          level = 'warning';
          message = title ? title : route;
        } else {
          level = 'error';
          message = exception;
        }

        Sentry.captureMessage(message, {
          level: level,
          user: {
            ip_address: request?.headers['x-forwarded-for'] || null,
          },
          extra: {
            request: {
              request: JSON.stringify(request),
              headers: headers,
              body: body,
              route: route,
              method: method,
              params: queryParams,
              version: request?.headers['version'] || null,
              language: request?.headers['language'] || null,
              jwt: jwt,
            },
            response: {
              status: exception.getStatus(),
              payload: payload,
            },
            exception: exception,
          },
          contexts: {
            response: {
              status_code: exception.getStatus(),
            },
          },
        });
      }

      super.catch(exception, host);
    } catch (error) {
      Sentry.captureException(exception);
      super.catch(exception, host);
    }
  }
}
