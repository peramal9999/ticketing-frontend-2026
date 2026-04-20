export type UserRole = 'admin' | 'support' | 'end_user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions?: string[];
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  tokenType?: string;
  user: User;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginApiResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  expiresIn?: number;
  expires_in?: number;
  user?: Partial<User> & Record<string, unknown>;
  data?: LoginApiResponse;
  [key: string]: unknown;
}
