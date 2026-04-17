export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'viewer';
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}
