import "@hapi/hapi";

declare module "@hapi/hapi" {
  interface CookieAuth {
    set(session: { id?: string }): void;
    clear(): void;
  }

  interface Request {
    cookieAuth: CookieAuth;
  }
}
