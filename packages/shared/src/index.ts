export * from './helpers';
export * from './validation';
export * from './response';
import type { z } from 'zod';



export interface XRequest {
  ip?: string;
  params: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
  headers: Record<string, string | string[] | undefined>;
  cookies: Record<string, string>;
  user?: XUser;
  app: XApp;
  validate<T extends z.ZodTypeAny>(schema: T): z.infer<T>;
  file(name: string): Promise<XFile | undefined>;
  files(name?: string): Promise<XFile[]>;
}

export interface XFile {
  fieldname: string;
  filename: string;
  mimetype: string;
  encoding: string;
  /** Stores the file in the designated path using the StorageManager. Returns the path. */
  store(path: string): Promise<string>;
  /** Gets the file content as a Buffer */
  getBuffer(): Promise<Buffer>;
}




export interface XResponse {
  setHeader(name: string, value: string): XResponse;
  json(data: unknown): XResponse;
  status(code: number): XResponse;
  send(data?: string): XResponse;
  redirect(url: string): void;
  setCookie(name: string, value: string, opts?: CookieOptions): XResponse;
}

export type XNext = () => Promise<void>;

export type XMiddleware = (
  req: XRequest,
  res: XResponse,
  next: XNext,
) => Promise<void>;

export interface XUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface XApp {
  make<T>(key: string): T;
}

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

