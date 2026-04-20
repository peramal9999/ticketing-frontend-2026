let currentToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const tokenStore = {
  get token(): string | null {
    return currentToken;
  },
  setToken(token: string | null): void {
    currentToken = token;
  },
  onUnauthorized(handler: () => void): void {
    unauthorizedHandler = handler;
  },
  notifyUnauthorized(): void {
    unauthorizedHandler?.();
  },
};
