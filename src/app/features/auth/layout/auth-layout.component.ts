import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { BrandLogoComponent } from '../../../shared/components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ThemeToggleComponent, BrandLogoComponent],
  template: `
    <div class="app-gradient-bg relative min-h-screen">
      <header
        class="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 sm:px-8"
      >
        <app-brand-logo [height]="36" />
        <div class="flex items-center gap-2">
          <button
            type="button"
            aria-label="Help"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-surface-200 bg-surface-0 text-surface-600 hover:bg-surface-100 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            <span class="material-icons text-[20px]">help_outline</span>
          </button>
          <app-theme-toggle />
        </div>
      </header>

      <main class="flex min-h-screen items-center justify-center px-4">
        <router-outlet />
      </main>

      <footer
        class="absolute inset-x-0 bottom-0 flex flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-surface-500 sm:flex-row sm:px-8 dark:text-surface-400"
      >
        <span>&copy; 2026 Peramal Services. All rights reserved.</span>
        <nav class="flex items-center gap-4">
          <a class="hover:text-brand-600 dark:hover:text-brand-300" href="#">Security Policy</a>
          <a class="hover:text-brand-600 dark:hover:text-brand-300" href="#">Privacy</a>
          <a class="hover:text-brand-600 dark:hover:text-brand-300" href="#">Terms of Service</a>
        </nav>
      </footer>
    </div>
  `,
})
export class AuthLayoutComponent {}
