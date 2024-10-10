/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const originalSend = res.send;
      res.send = function (output: any): Response {
        const route = req?.originalUrl || null;
        const regex = /([^/]+)\/v(\d+)\/([^/]+)/;
        const match = route.match(regex);
        let route_module = '';
        if (match) {
          route_module = match[3];
        }

        if (route_module != 'health') {
          let level: Sentry.SeverityLevel = 'debug';
          let message: string;
          let title: string;
          const tags = {};
          tags['user_agent'] = req?.headers['user-agent'];

          try {
            const payloadObj = JSON.parse(output);
            title = payloadObj?.meta?.message[0]?.text?.client;
          } catch (e) {}

          let user = null;
          let _user = null;
          try {
            _user = JSON.stringify(req['jwt']['user']);
            user = JSON.parse(_user);
            tags['userId'] = user['id'];
          } catch (e) {}

          if (res.statusCode >= 200 && res.statusCode < 400) {
            level = 'debug';
            tags['status'] = 'SUCCESS';
          } else if (res.statusCode >= 400 && res.statusCode < 500) {
            level = 'warning';
            tags['status'] = 'FAULT';
          } else {
            level = 'error';
            tags['status'] = 'ERROR';
          }

          try {
            if (user) {
              message = user['id'] + ':' + (title ? title : route);
            } else {
              message = title ? title : route;
            }
          } catch (e) {}

          if (req?.headers['x-forwarded-for']) {
            tags['ip'] = req?.headers['x-forwarded-for'];
          }

          Sentry.captureMessage(message, {
            level: level,
            // user: {
            //   ip_address: req?.headers['x-forwarded-for'],
            //   id: user?['id']
            // },
            tags: tags,
            extra: {
              data: {
                body: JSON.stringify(req?.body) || null,
                reponse: output,
                headers: req?.headers,
                route: route,
                method: req?.method,
                params: req?.query,
                user: _user,
                date: new Date(),
              },
              request: req,
              response: res,
            },
            contexts: {
              response: {
                status_code: res.statusCode,
              },
            },
          });
        }

        return originalSend.call(this, output);
      };
    } catch (error) {
      console.error('error on sentry insert!: ', error);
    } finally {
      next();
    }
  }
}
