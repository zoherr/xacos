export interface XRequest {
  params: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
  headers: Record<string, string | string[] | undefined>;
  user?: XUser;
  app: XApp;
}

export interface XResponse {
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
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}
