import { LoggerService as NestLoggerService } from '@nestjs/common';
import { configure, getLogger } from 'log4js';

import type { Logger, Configuration, Layout } from 'log4js';

const layout: Layout = {
  type: 'pattern',
  pattern: '%d{ISO8601_WITH_TZ_OFFSET} [%p] %m',
};

export class LoggerService implements NestLoggerService {
  private static _logger: Logger;

  constructor() {
    if (LoggerService._logger) {
      return this;
    }

    const config: Configuration = {
      appenders: {
        stdout: { type: 'stdout', layout },
      },
      categories: {
        default: {
          appenders: ['stdout'],
          level: 'debug',
        },
        error: {
          appenders: ['stdout'],
          level: 'debug',
        },
      },
    };

    configure(config);
    LoggerService._logger = getLogger();
  }

  public log(message: string) {
    this.info(message);
  }

  public debug(message: string) {
    LoggerService._logger.debug(this.parseMessage(message));
  }

  public info(message: string) {
    LoggerService._logger.info(this.parseMessage(message));
  }

  public warn(message: string) {
    LoggerService._logger.warn(this.parseMessage(message));
  }

  public error(message: string, trace?: string) {
    const errorLogger = getLogger('error');
    if (trace) {
      errorLogger.error(`${message}\n${trace}`);
    } else {
      errorLogger.error(message);
    }
  }

  private parseMessage(message: any): string {
    let parsed: any;

    switch (true) {
      case message instanceof Error:
        parsed = message.stack;
        break;

      case typeof message === 'string':
      case typeof message === 'number':
      case typeof message === 'symbol':
        parsed = message;
        break;

      default:
        parsed = JSON.stringify(message, null, 4);
        break;
    }
    return parsed;
  }
}
