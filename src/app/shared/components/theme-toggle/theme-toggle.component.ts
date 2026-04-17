import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="theme.toggle()"
      [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-200 bg-surface-0 text-surface-600 transition-colors hover:bg-surface-100 hover:text-brand-600 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300 dark:hover:bg-surface-800"
    >
      @if (theme.theme() === 'dark') {
        <span class="material-icons text-[20px]">light_mode</span>
      } @else {
        <span class="material-icons text-[20px]">dark_mode</span>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);
}
