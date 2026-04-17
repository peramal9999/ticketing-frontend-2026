import { Inject, Injectable, PLATFORM_ID, computed, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, delay, of, throwError } from 'rxjs';
import { AuthSession, LoginRequest, User } from '../models/user.model';

const SESSION_STORAGE_KEY = 'app-auth-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isBrowser: boolean;
  private readonly currentSession = signal<AuthSession | null>(null);

  readonly session = this.currentSession.asReadonly();
  readonly user = computed(() => this.currentSession()?.user ?? null);
  readonly isAuthenticated = computed(() => {
    const session = this.currentSession();
    return !!session && session.expiresAt > Date.now();
  });

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.restoreSession();
  }

  login(request: LoginRequest): Observable<AuthSession> {
    if (!request.email || !request.password) {
      return throwError(() => new Error('Email and password are required.'));
    }
    const user: User = {
      id: 'usr_' + Math.random().toString(36).slice(2, 10),
      email: request.email,
      name: request.email.split('@')[0].replace('.', ' '),
      role: 'admin',
    };
    const session: AuthSession = {
      token: 'mock.' + Math.random().toString(36).slice(2),
      user,
      expiresAt: Date.now() + 1000 * 60 * 60 * (request.rememberMe ? 24 * 7 : 8),
    };
    return of(session).pipe(delay(600));
  }

  setSession(session: AuthSession): void {
    this.currentSession.set(session);
    this.persistSession(session);
  }

  logout(): void {
    this.currentSession.set(null);
    if (this.isBrowser) {
      try {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        /* storage unavailable */
      }
    }
  }

  requestPasswordReset(email: string): Observable<{ ok: true; email: string }> {
    if (!email) return throwError(() => new Error('Email required'));
    return of({ ok: true as const, email }).pipe(delay(500));
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<{ ok: true }> {
    if (!currentPassword || !newPassword) {
      return throwError(() => new Error('Passwords required'));
    }
    return of({ ok: true as const }).pipe(delay(500));
  }

  token(): string | null {
    return this.currentSession()?.token ?? null;
  }

  private restoreSession(): void {
    if (!this.isBrowser) return;
    try {
      const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) return;
      const session = JSON.parse(stored) as AuthSession;
      if (session.expiresAt > Date.now()) {
        this.currentSession.set(session);
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
