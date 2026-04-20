import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
      <span class="material-icons text-[64px] text-red-500">block</span>
      <h1 class="mt-4 text-2xl font-bold text-surface-900 dark:text-surface-50">
        You don't have access
      </h1>
      <p class="mt-2 text-sm text-surface-500 dark:text-surface-400">
        Your role <strong>{{ auth.role() ?? 'guest' }}</strong> doesn't allow viewing this page.
      </p>
      <button
        type="button"
        (click)="location.back()"
        class="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Go back
      </button>
    </section>
  `,
})
export class ForbiddenComponent {
  readonly auth = inject(AuthService);
  readonly location = inject(Location);
}
