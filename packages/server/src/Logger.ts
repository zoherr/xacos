import pino from 'pino';

export class Logger {
  private logger: pino.Logger;

  constructor() {
    const isDev = process.env["APP_ENV"] !== "production";
    this.logger = pino({
      level: process.env["APP_DEBUG"] === "true" || isDev ? "debug" : "info",
      transport: isDev
        ? {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          }
        : undefined,
    } as any);

  }

  info(message: string, ...args: any[]) {
    this.logger.info(message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.logger.error(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.logger.warn(message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.logger.debug(message, ...args);
  }

  fatal(message: string, ...args: any[]) {
    this.logger.fatal(message, ...args);
  }
}

export const log = new Logger();

