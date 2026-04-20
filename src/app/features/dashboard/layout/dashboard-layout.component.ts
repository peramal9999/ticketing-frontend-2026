import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { BrandLogoComponent } from '../../../shared/components/brand-logo/brand-logo.component';
import type { UserRole } from '../../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent, BrandLogoComponent],
  template: `
    <div class="app-gradient-bg flex min-h-screen">
      <!-- Sidebar (desktop) -->
      <aside
        class="hidden w-64 shrink-0 flex-col border-r border-surface-200 bg-surface-0/80 backdrop-blur-md lg:flex dark:border-surface-800 dark:bg-surface-900/70"
      >
        <div class="px-6 mt-3">
          <app-brand-logo [height]="40" />
        </div>
        <div class="my-1  h-px bg-surface-200 dark:bg-surface-800"></div>
        <nav class="flex-1 mt-2 space-y-1 px-3 pb-4">
          @for (navItem of visibleNavItems(); track navItem.route) {
            <a
              [routerLink]="navItem.route"
              routerLinkActive="bg-brand-500 text-white shadow"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
            >
              <span class="material-icons text-[20px]">{{ navItem.icon }}</span>
              {{ navItem.label }}
            </a>
          }
        </nav>
      </aside>

      <!-- Mobile sidebar drawer -->
      @if (mobileNavOpen()) {
        <div
          class="fixed inset-0 z-40 bg-surface-900/50 backdrop-blur-sm lg:hidden"
          (click)="mobileNavOpen.set(false)"
        ></div>
        <aside
          class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-surface-200 bg-surface-0 shadow-xl lg:hidden dark:border-surface-800 dark:bg-surface-900"
        >
          <div class="flex items-center justify-between px-6 py-6">
            <app-brand-logo [height]="32" />
            <button
              type="button"
              (click)="mobileNavOpen.set(false)"
              class="rounded p-1 text-surface-500 hover:text-surface-900 dark:hover:text-surface-50"
              aria-label="Close navigation"
            >
              <span class="material-icons text-[20px]">close</span>
            </button>
          </div>
          <nav class="flex-1 space-y-1 px-3 pb-4">
            @for (navItem of visibleNavItems(); track navItem.route) {
              <a
                [routerLink]="navItem.route"
                routerLinkActive="bg-brand-500 text-white"
                (click)="mobileNavOpen.set(false)"
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
              >
                <span class="material-icons text-[20px]">{{ navItem.icon }}</span>
                {{ navItem.label }}
              </a>
            }
          </nav>
        </aside>
      }

      <div class="flex min-w-0 flex-1 flex-col">
        <!-- Top bar -->
        <header
          class="relative z-30 flex items-center gap-3 border-b border-surface-200 bg-surface-0/80 px-4 py-3 backdrop-blur-md sm:px-6 dark:border-surface-800 dark:bg-surface-900/70"
        >
          <button
            type="button"
            (click)="mobileNavOpen.set(true)"
            class="rounded-lg p-2 text-surface-600 hover:bg-surface-100 lg:hidden dark:text-surface-300 dark:hover:bg-surface-800"
            aria-label="Open navigation"
          >
            <span class="material-icons text-[22px]">menu</span>
          </button>

          <div class="relative flex-1 max-w-xl">
            <span
              class="material-icons pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-surface-400"
              >search</span
            >
            <input
              type="search"
              placeholder="Search ledger or ticket ID..."
              class="w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-10 pr-3 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-50"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            class="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            <span class="material-icons text-[22px]">notifications_none</span>
            <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <button
            type="button"
            aria-label="Help"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800"
          >
            <span class="material-icons text-[22px]">help_outline</span>
          </button>
          <app-theme-toggle />

          <div class="relative">
            <button
              type="button"
              (click)="userMenuOpen.set(!userMenuOpen())"
              class="flex items-center gap-2 rounded-full border border-surface-200 bg-surface-0 py-1 pl-1 pr-2 text-sm font-semibold text-surface-700 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200"
            >
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs text-white"
                >{{ initials() }}</span
              >
              <span class="material-icons text-[18px]">expand_more</span>
            </button>
            @if (userMenuOpen()) {
              <div
                class="absolute right-0 top-12 z-50 w-56 rounded-xl border border-surface-200 bg-surface-0 p-1 shadow-lg dark:border-surface-800 dark:bg-surface-900"
                (click)="userMenuOpen.set(false)"
              >
                <div class="px-3 py-2">
                  <p class="truncate text-sm font-semibold text-surface-900 dark:text-surface-50">
                    {{ auth.user()?.name ?? 'Account' }}
                  </p>
                  <p class="truncate text-xs text-surface-500 dark:text-surface-400">
                    {{ auth.user()?.email }}
                  </p>
                </div>
                <div class="my-1 h-px bg-surface-200 dark:bg-surface-800"></div>
                <a
                  routerLink="/account/profile"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-200 dark:hover:bg-surface-800"
                >
                  <span class="material-icons text-[18px]">person</span> Account
                </a>
                <button
                  type="button"
                  (click)="logout()"
                  class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <span class="material-icons text-[18px]">logout</span> Sign out
                </button>
              </div>
            }
          </div>
        </header>

        <main class="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mobileNavOpen = signal(false);
  readonly userMenuOpen = signal(false);

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard/overview',
      roles: ['admin', 'support', 'end_user'],
    },
    {
      label: 'Tickets',
      icon: 'confirmation_number',
      route: '/dashboard/tickets',
      roles: ['admin', 'support', 'end_user'],
    },
    { label: 'Users', icon: 'group', route: '/dashboard/users', roles: ['admin'] },
    { label: 'Settings', icon: 'settings', route: '/dashboard/settings', roles: ['admin'] },
  ];

  readonly visibleNavItems = computed(() =>
    this.navItems.filter((item) => !item.roles || this.auth.hasRole(...item.roles)),
  );

  initials(): string {
    const displayName = this.auth.user()?.name ?? this.auth.user()?.email ?? 'U';
    return displayName
      .split(/\s+|\./)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
