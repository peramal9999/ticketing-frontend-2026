import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 px-4 py-6 backdrop-blur-sm"
      (click)="onBackdropClick($event)"
    >
      <div
        class="w-full max-w-lg overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-2xl dark:border-surface-800 dark:bg-surface-900"
      >
        <div
          class="flex items-start justify-between border-b border-surface-200 px-6 py-5 dark:border-surface-800"
        >
          <div>
            <h2 class="text-xl font-bold text-surface-900 dark:text-surface-50">Change Password</h2>
            <p class="mt-1 text-sm text-surface-500 dark:text-surface-400">
              Ensure your account is using a long, random password to stay secure.
            </p>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="rounded-full p-1.5 text-surface-500 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
            aria-label="Close"
          >
            <span class="material-icons text-[20px]">close</span>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5 px-6 py-6">
          <div>
            <label for="current" class="mb-1.5 block text-sm font-semibold text-surface-800 dark:text-surface-100">
              Current Password
            </label>
            <div class="relative">
              <input
                id="current"
                [type]="showCurrent() ? 'text' : 'password'"
                formControlName="currentPassword"
                autocomplete="current-password"
                class="w-full rounded-lg border border-surface-200 bg-brand-50/40 py-2.5 pl-3 pr-10 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-50"
              />
              <button
                type="button"
                (click)="showCurrent.set(!showCurrent())"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                [attr.aria-label]="showCurrent() ? 'Hide password' : 'Show password'"
              >
                <span class="material-icons text-[18px]">{{
                  showCurrent() ? 'visibility_off' : 'visibility'
                }}</span>
              </button>
            </div>
          </div>

          <div>
            <label for="new" class="mb-1.5 block text-sm font-semibold text-surface-800 dark:text-surface-100">
              New Password
            </label>
            <div class="relative">
              <input
                id="new"
                [type]="showNew() ? 'text' : 'password'"
                formControlName="newPassword"
                autocomplete="new-password"
                class="w-full rounded-lg border border-surface-200 bg-brand-50/40 py-2.5 pl-3 pr-10 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-50"
              />
              <button
                type="button"
                (click)="showNew.set(!showNew())"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
                [attr.aria-label]="showNew() ? 'Hide password' : 'Show password'"
              >
                <span class="material-icons text-[18px]">{{
                  showNew() ? 'visibility_off' : 'visibility'
                }}</span>
              </button>
            </div>

            <ul class="mt-3 grid grid-cols-1 gap-y-1.5 text-xs sm:grid-cols-2">
              <li class="flex items-center gap-1.5" [class.text-brand-600]="rules().minLength" [class.dark:text-brand-300]="rules().minLength" [class.text-surface-500]="!rules().minLength" [class.dark:text-surface-400]="!rules().minLength">
                <span class="material-icons text-[16px]">{{ rules().minLength ? 'check_circle' : 'radio_button_unchecked' }}</span>
                At least 8 characters
              </li>
              <li class="flex items-center gap-1.5" [class.text-brand-600]="rules().special" [class.dark:text-brand-300]="rules().special" [class.text-surface-500]="!rules().special" [class.dark:text-surface-400]="!rules().special">
                <span class="material-icons text-[16px]">{{ rules().special ? 'check_circle' : 'radio_button_unchecked' }}</span>
                One special character
              </li>
              <li class="flex items-center gap-1.5" [class.text-brand-600]="rules().uppercase" [class.dark:text-brand-300]="rules().uppercase" [class.text-surface-500]="!rules().uppercase" [class.dark:text-surface-400]="!rules().uppercase">
                <span class="material-icons text-[16px]">{{ rules().uppercase ? 'check_circle' : 'radio_button_unchecked' }}</span>
                One uppercase letter
              </li>
              <li class="flex items-center gap-1.5" [class.text-brand-600]="rules().number" [class.dark:text-brand-300]="rules().number" [class.text-surface-500]="!rules().number" [class.dark:text-surface-400]="!rules().number">
                <span class="material-icons text-[16px]">{{ rules().number ? 'check_circle' : 'radio_button_unchecked' }}</span>
                One number
              </li>
            </ul>
          </div>

          <div>
            <label for="confirm" class="mb-1.5 block text-sm font-semibold text-surface-800 dark:text-surface-100">
              Confirm New Password
            </label>
            <input
              id="confirm"
              type="password"
              formControlName="confirmPassword"
              autocomplete="new-password"
              class="w-full rounded-lg border border-surface-200 bg-brand-50/40 py-2.5 px-3 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-50"
            />
            @if (mismatch()) {
              <p class="mt-1 text-xs text-red-600 dark:text-red-400">Passwords do not match.</p>
            }
          </div>

          <div class="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              [disabled]="form.invalid || mismatch() || loading()"
              class="inline-flex flex-1 items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ loading() ? 'Updating...' : 'Update Password' }}
            </button>
            <button
              type="button"
              (click)="close.emit()"
              class="rounded-lg border border-surface-200 bg-surface-0 px-4 py-2.5 text-sm font-semibold text-surface-700 hover:bg-surface-50 sm:flex-none dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:bg-surface-800"
            >
              Cancel
            </button>
          </div>
        </form>

        <div
          class="flex items-start gap-2 border-t border-surface-200 bg-surface-50 px-6 py-4 text-xs text-surface-600 dark:border-surface-800 dark:bg-surface-950/50 dark:text-surface-300"
        >
          <span class="material-icons text-[18px] text-brand-500">info</span>
          <p>
            Changing your password will log you out of all other active sessions across your devices.
            This action cannot be undone.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ChangePasswordDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly close = output<void>();
  readonly saved = output<void>();

  readonly loading = signal(false);
  readonly showCurrent = signal(false);
  readonly showNew = signal(false);

  readonly form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  private readonly newPasswordValue = toSignal(this.form.controls.newPassword.valueChanges, {
    initialValue: '',
  });
  private readonly confirmPasswordValue = toSignal(
    this.form.controls.confirmPassword.valueChanges,
    { initialValue: '' },
  );

  readonly rules = computed(() => {
    const value = this.newPasswordValue() ?? '';
    return {
      minLength: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    };
  });

  readonly mismatch = computed(() => {
    const newPassword = this.newPasswordValue() ?? '';
    const confirmPassword = this.confirmPasswordValue() ?? '';
    return !!confirmPassword && newPassword !== confirmPassword;
  });

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close.emit();
  }

  submit(): void {
    if (this.form.invalid || this.mismatch() || this.loading()) return;
    this.loading.set(true);
    const { currentPassword, newPassword } = this.form.getRawValue();
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.saved.emit();
      },
      error: () => this.loading.set(false),
    });
  }
}
