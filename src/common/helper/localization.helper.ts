import { I18nContext, Path } from 'nestjs-i18n';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LanguageListEnum } from '../enum';
import { MessageInterface } from '../interfaces';

export class LocalizationHelper {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  static message(_key: string | any, args?: any, hasError: boolean = false, httpStatus?: HttpStatus, errors?: any) {
    const key = _key as Path<any | any[]>;

    if (Array.isArray(key)) {
      throw new HttpException(
        {
          meta: {
            serverTime: new Date(),
            hasError: hasError,
            message: key,
          },
        },
        httpStatus || HttpStatus.BAD_REQUEST,
      );
    }

    if (!args) args = { lang: 'en' };
    args.lang = args.lang.replace(LanguageListEnum.ENGLISH, 'en');

    const i18n = I18nContext.current<any>();

    if (!i18n) {
      throw new HttpException(
        {
          meta: {
            serverTime: new Date(),
            hasError: true,
            message: [
              {
                code: {
                  enum: 'LANGUAGE_NOT_SUPPORTED!',
                  number: 10400,
                },
                text: {
                  developer: `${errors}`,
                  client: 'Your language not supported!',
                },
              },
            ],
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const message = i18n.translate(key, args) as MessageInterface;

    if (httpStatus)
      throw new HttpException(
        {
          meta: {
            serverTime: new Date(),
            hasError: hasError,
            message: [
              {
                code: message.code,
                text: {
                  developer: `${errors}`,
                  client: message.text.client,
                },
              },
            ],
          },
        },
        httpStatus || HttpStatus.BAD_REQUEST,
      );

    return {
      serverTime: new Date(),
      hasError: hasError,
      message: [
        {
          code: message.code,
          text: message.text,
        },
      ],
    };
  }
}

export class localization extends LocalizationHelper {}
