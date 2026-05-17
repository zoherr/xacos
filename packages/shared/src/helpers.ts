/**
 * Throw this to trigger a redirect from inside an API handler.
 * The global error handler in Sprint 106 catches it and sends 302.
 */
export class XRedirect {
  readonly __xacos_redirect = true;
  constructor(
    public readonly url: string,
    public readonly statusCode: 302 | 301 = 302
  ) { }
}

/**
 * Use inside API handlers to redirect.
 * @example throw serverRedirect('/login')
 */
export function serverRedirect(url: string, permanent = false): never {
  throw new XRedirect(url, permanent ? 301 : 302);
}

