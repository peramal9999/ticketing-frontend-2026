import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, from, map } from 'rxjs';
import { AuthSession, LoginApiResponse, LoginRequest, User, UserRole } from '../models/user.model';
import { apiClient, ApiErrorPayload } from '../api/api-client';
import { tokenStore } from '../api/token-store';

const SESSION_STORAGE_KEY = 'app-auth-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isBrowser: boolean;
  private readonly currentSession = signal<AuthSession | null>(null);

  readonly session = this.currentSession.asReadonly();
  readonly user = computed(() => this.currentSession()?.user ?? null);
  readonly role = computed<UserRole | null>(() => this.currentSession()?.user.role ?? null);
  readonly isAuthenticated = computed(() => {
    const session = this.currentSession();
    return !!session && session.expiresAt > Date.now();
  });

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    tokenStore.onUnauthorized(() => this.logout());
    this.restoreSession();
  }

  login(request: LoginRequest): Observable<AuthSession> {
    return from(
      apiClient.post<LoginApiResponse>('/auth/login', {
        email: request.email,
        password: request.password,
      }),
    ).pipe(
      map((response) => {
        const session = this.toSession(response.data, request.rememberMe);
        this.setSession(session);
        return session;
      }),
    );
  }

  setSession(session: AuthSession): void {
    this.currentSession.set(session);
    tokenStore.setToken(session.token);
    this.persistSession(session);
  }

  logout(): void {
    this.currentSession.set(null);
    tokenStore.setToken(null);
    if (this.isBrowser) {
      try {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        /* storage unavailable */
      }
    }
  }

  requestPasswordReset(email: string): Observable<{ ok: true; email: string }> {
    return from(apiClient.post('/auth/forgot-password', { email })).pipe(
      map(() => ({ ok: true as const, email })),
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ ok: true }> {
    return from(
      apiClient.post('/auth/change-password', { currentPassword, newPassword }),
    ).pipe(map(() => ({ ok: true as const })));
  }

  token(): string | null {
    return this.currentSession()?.token ?? null;
  }

  hasRole(...roles: UserRole[]): boolean {
    const current = this.role();
    return !!current && roles.includes(current);
  }

  hasPermission(permission: string): boolean {
    return this.currentSession()?.user.permissions?.includes(permission) ?? false;
  }

  private toSession(payload: LoginApiResponse, rememberMe?: boolean): AuthSession {
    const body = payload.data ?? payload;
    const token = (body.token ?? body.accessToken ?? body.access_token) as string | undefined;
    if (!token) {
      throw { status: 500, message: 'Login response missing token' } satisfies ApiErrorPayload;
    }

    const expiresRaw = (body.expiresIn ?? body.expires_in) as number | undefined;
    const expiresAt =
      typeof expiresRaw === 'number'
        ? Date.now() + (expiresRaw > 1e7 ? expiresRaw : expiresRaw * 1000)
        : Date.now() + 1000 * 60 * 60 * (rememberMe ? 24 * 7 : 8);

    const rawUser = (body.user ?? {}) as Record<string, unknown>;
    const firstName = (rawUser['firstName'] as string) ?? '';
    const lastName = (rawUser['lastName'] as string) ?? '';
    const composedName = [firstName, lastName].filter(Boolean).join(' ').trim();

    const rawRole = String(
      rawUser['role'] ?? rawUser['userRole'] ?? 'end_user',
    ).toLowerCase() as UserRole;

    const user: User = {
      id: String(rawUser['id'] ?? rawUser['_id'] ?? rawUser['userId'] ?? 'unknown'),
      email: String(rawUser['email'] ?? ''),
      name:
        composedName ||
        (rawUser['name'] as string) ||
        (rawUser['fullName'] as string) ||
        (rawUser['username'] as string) ||
        (rawUser['email'] as string) ||
        'User',
      role: rawRole as UserRole,
      permissions: Array.isArray(rawUser['permissions'])
        ? (rawUser['permissions'] as string[])
        : undefined,
    };

    return {
      token,
      refreshToken: (body['refreshToken'] as string | undefined) ?? undefined,
      tokenType: (body['tokenType'] as string | undefined) ?? 'Bearer',
      user,
      expiresAt,
    };
  }

  private restoreSession(): void {
    if (!this.isBrowser) return;
    try {
      const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return;
      const session = JSON.parse(stored) as AuthSession;
      if (session.expiresAt > Date.now()) {
        this.currentSession.set(session);
        tokenStore.setToken(session.token);
      } else {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      /* invalid or unavailable */
    }
  }

  private persistSession(session: AuthSession): void {
    if (!this.isBrowser) return;
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      /* storage unavailable */
    }
  }
}
