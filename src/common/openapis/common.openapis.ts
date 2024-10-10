import { HttpStatus } from '@nestjs/common';

export const CommonResponseOpenApi = {
  ServiceUnavaiableResponse: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'The service is currently unavailable. Please try again later.',
    schema: {
      example: {
        meta: {
          serverTime: '2023-09-14T14:55:49.947Z',
          hasError: true,
          message: [
            {
              code: {
                enum: 'SERVICE_UNAVAILABLE_ERROR',
                number: 10503,
              },
              text: {
                developer: 'The service is currently unavailable. Please try again later.',
                client: 'Service unavailable!',
              },
            },
          ],
        },
      },
    },
  },
  UnauthorizedResponse: {
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Access unauthorized. Please provide a valid token. Your current token may have expired or is not valid for this request.',
    schema: {
      example: {
        meta: {
          serverTime: '2023-09-14T14:55:49.947Z',
          hasError: true,
          message: [
            {
              code: {
                enum: 'SERVICE_UNAVAILABLE_ERROR',
                number: 10503,
              },
              text: {
                developer:
                  'Access unauthorized. Please provide a valid token. Your current token may have expired or is not valid for this request.',
                client: 'Unauthorized access',
              },
            },
          ],
        },
      },
    },
  },
  ForbiddenResourceResponse: {
    status: HttpStatus.FORBIDDEN,
    description: 'Permission denied. You do not have the required access rights.',
    schema: {
      example: {
        meta: {
          serverTime: '2023-09-14T14:55:49.947Z',
          hasError: true,
          message: [
            {
              code: {
                enum: 'FORBIDDEN_RESOURCE_ERROR',
                number: 10403,
              },
              text: {
                developer: 'Permission denied. You do not have the required access rights.',
                client: 'Permission denied',
              },
            },
          ],
        },
      },
    },
  },
  UserBannedResponse: {
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'The user banned by the admin!, please redirect to login page immediately!',
    schema: {
      example: {
        meta: {
          serverTime: '2023-09-14T14:55:49.947Z',
          hasError: true,
          message: [
            {
              code: {
                enum: 'USER_BANNED',
                number: 10406,
              },
              text: {
                developer: 'The user banned by the admin!, please redirect to login page immediately!',
                client: 'SampleChallenge has banned your account!',
              },
            },
          ],
        },
      },
    },
  },
  InternalServerErrorResponse: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal server error occurred. Please contact support for assistance.',
    schema: {
      example: {
        meta: {
          serverTime: '2023-09-14T14:55:49.947Z',
          hasError: true,
          message: [
            {
              code: {
                enum: 'INTERNAL_SERVER_ERROR',
                number: 10500,
              },
              text: {
                developer: 'An internal server error occurred. Please contact support for assistance.',
                client: 'Server error!',
              },
            },
          ],
        },
      },
    },
  },
  TooManyRequestResponse: {
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Too many requests. you are send a lot of request for server, your banned temporarily.',
    schema: {
      example: {
        meta: {
          serverTime: '2023-09-14T14:55:49.947Z',
          hasError: true,
          message: [
            {
              code: {
                enum: 'TOO_MANY_REQUEST_ERROR',
                number: 10429,
              },
              text: {
                developer: 'Too many requests. you are send a lot of request for server, your banned temporarily.',
                client: 'Too many attempts, please try again later.',
              },
            },
          ],
        },
      },
    },
  },
};
