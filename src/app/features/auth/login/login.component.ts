import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrandLogoComponent } from '../../../shared/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, BrandLogoComponent],
  template: `
    <section class="w-full max-w-md">
      <div class="mb-8 flex flex-col items-center text-center">
        <app-brand-logo class="mb-4" [height]="65" />
        <h1 class="text-2xl font-bold text-brand-600 sm:text-3xl dark:text-brand-300">
          Ticketing System
        </h1>
        <p class="mt-2 text-sm text-surface-500 dark:text-surface-400">
          Enter your credentials to access the Ticketing System.
        </p>
      </div>

      <div
        class="rounded-2xl border border-surface-200 bg-surface-0 p-6 shadow-lg shadow-surface-900/5 sm:p-8 dark:border-surface-800 dark:bg-surface-900 dark:shadow-black/30"
      >
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
          <div>
            <label for="email" class="mb-1.5 block text-sm font-semibold text-surface-800 dark:text-surface-100">
              Email Address
            </label>
            <div class="relative">
              <span
                class="material-icons pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-surface-400"
                >mail</span
              >
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="name@company.com"
                autocomplete="email"
                class="w-full rounded-lg border border-surface-200 bg-surface-50 py-2.5 pl-10 pr-3 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-50"
              />
            </div>
          </div>

          <div>
            <div class="mb-1.5 flex items-center justify-between">
              <label for="password" class="text-sm font-semibold text-surface-800 dark:text-surface-100">
                Password
              </label>
              <a
                routerLink="/auth/forgot-password"
                class="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300"
              >
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <span
                class="material-icons pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-surface-400"
                >lock</span
              >
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full rounded-lg border border-surface-200 bg-surface-50 py-2.5 pl-10 pr-10 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-50"
              />
              <button
                type="button"
                (click)="showPassword.set(!showPassword())"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
              >
                <span class="material-icons text-[18px]">{{
                  showPassword() ? 'visibility_off' : 'visibility'
                }}</span>
              </button>
            </div>
          </div>

          <label class="flex cursor-pointer select-none items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
            <input
              type="checkbox"
              formControlName="rememberMe"
              class="h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500 dark:border-surface-600 dark:bg-surface-800"
            />
            Keep me signed in on this device
          </label>

          @if (errorMessage()) {
            <div
              class="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
            >
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            @if (loading()) {
              <span class="material-icons animate-spin text-[18px]">progress_activity</span>
              <span>Signing in...</span>
            } @else {
              <span class="material-icons text-[18px]">login</span>
              <span>Sign In</span>
            }
          </button>

          <div class="border-t border-surface-200 pt-4 text-center text-xs text-surface-500 dark:border-surface-800 dark:text-surface-400">
            Access is monitored and logged.
          </div>
        </form>
      </div>
    </section>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: (session) => {
        this.auth.setSession(session);
        const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/dashboard';
        this.router.navigateByUrl(redirect);
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message ?? 'Unable to sign in.');
        this.loading.set(false);
      },
    });
  }
}
