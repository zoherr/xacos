import type { XMiddleware } from '@xacos/shared';
import type { ServiceProvider, Application } from '@xacos/core';

export interface XacosConfig {
  port?: number;
  providers?: Array<new (app: Application) => ServiceProvider>;
  middleware?: {
    global?: XMiddleware[];
    api?: XMiddleware[];
    web?: XMiddleware[];
  };
  views?: {
    dir?: string;
    defaultLayout?: string;
  };
  api?: {
    prefix?: string;
    dir?: string;
  };
  database?: {
    driver?: 'mysql' | 'postgres' | 'sqlite' | 'mongodb';
  };
  cors?: {
    origin?: string | string[] | boolean;
    credentials?: boolean;
    methods?: string[];
  };
  rateLimit?: {
    max?: number;
    timeWindow?: string | number;
  };
  mail?: {
    driver?: 'smtp' | 'log' | 'ses' | 'mailgun' | 'postmark' | 'resend';

    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    from?: string;
    ses?: {
      region?: string;
      key?: string;
      secret?: string;
    };
  };
  cache?: {
    driver?: 'memory' | 'redis';
    prefix?: string;
  };
  storage?: {
    driver?: 'local' | 's3';
    local?: {
      root: string;
      publicUrl?: string;
    };
    s3?: {
      region: string;
      bucket: string;
      key: string;
      secret: string;
      publicUrl?: string;
    };
  };
}


