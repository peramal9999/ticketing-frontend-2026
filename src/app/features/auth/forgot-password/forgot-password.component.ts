import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="w-full max-w-md">
      <div
        class="rounded-2xl border border-surface-200 bg-surface-0 p-6 shadow-lg shadow-surface-900/5 sm:p-8 dark:border-surface-800 dark:bg-surface-900 dark:shadow-black/30"
      >
        <div class="mb-6 text-center">
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-50">Forgot Password?</h1>
          <p class="mt-2 text-sm text-surface-500 dark:text-surface-400">
            No worries, it happens. Enter your email below and we'll send you a recovery link.
          </p>
        </div>

        @if (sent()) {
          <div
            class="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-200"
          >
            If <strong>{{ sent() }}</strong> is registered, a reset link is on its way.
          </div>
        } @else {
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

            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ loading() ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>
        }

        <div class="mt-6 border-t border-surface-200 pt-4 text-center dark:border-surface-800">
          <a
            routerLink="/auth/login"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
          >
            <span class="material-icons text-[18px]">arrow_back</span>
            Back to Sign In
          </a>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-center gap-6 text-xs text-surface-500 dark:text-surface-400">
        <span class="flex items-center gap-1.5">
          <span class="material-icons text-[16px] text-surface-400">shield</span>
          End-to-end encryption
        </span>
        <span class="flex items-center gap-1.5">
          <span class="material-icons text-[16px] text-surface-400">vpn_key</span>
          Secure recovery protocol
        </span>
      </div>
    </section>
  `,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly sent = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    const email = this.form.controls.email.value;
    this.auth.requestPasswordReset(email).subscribe({
      next: () => {
        this.sent.set(email);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
