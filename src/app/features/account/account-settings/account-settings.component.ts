import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { BrandLogoComponent } from '../../../shared/components/brand-logo/brand-logo.component';
import { ChangePasswordDialogComponent } from '../change-password/change-password-dialog.component';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ThemeToggleComponent, BrandLogoComponent, ChangePasswordDialogComponent],
  template: `
    <div class="app-gradient-bg min-h-screen">
      <header
        class="flex items-center justify-between border-b border-surface-200 bg-surface-0/80 px-4 py-4 backdrop-blur-md sm:px-8 dark:border-surface-800 dark:bg-surface-900/70"
      >
        <a routerLink="/dashboard" class="inline-flex items-center" aria-label="Go to dashboard">
          <app-brand-logo [height]="36" />
        </a>
        <app-theme-toggle />
      </header>

      <main class="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        <h1 class="mb-6 text-2xl font-bold text-surface-900 dark:text-surface-50">Security</h1>

        <section class="space-y-4">
          <div
            class="rounded-xl border border-surface-200 bg-surface-0 p-6 dark:border-surface-800 dark:bg-surface-900"
          >
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50">Password</h2>
            <p class="mt-1 text-sm text-surface-500 dark:text-surface-400">
              Protect your account with a strong password.
            </p>
            <button
              type="button"
              (click)="isDialogOpen.set(true)"
              class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <span class="material-icons text-[18px]">lock_reset</span>
              Change Password
            </button>
          </div>

          <div
            class="rounded-xl border border-surface-200 bg-surface-0 p-6 dark:border-surface-800 dark:bg-surface-900"
          >
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-50">Active sessions</h2>
            <p class="mt-1 text-sm text-surface-500 dark:text-surface-400">
              Manage devices currently signed in to your account.
            </p>
          </div>
        </section>
      </main>

      @if (isDialogOpen()) {
        <app-change-password-dialog (close)="isDialogOpen.set(false)" (saved)="onPasswordSaved()" />
      }
    </div>
  `,
})
export class AccountSettingsComponent {
  readonly isDialogOpen = signal(false);

  onPasswordSaved(): void {
    this.isDialogOpen.set(false);
  }
}
