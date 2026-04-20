import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        canActivate: [roleGuard('admin', 'support', 'end_user')],
        loadComponent: () =>
          import('./pages/overview/overview.component').then((m) => m.OverviewComponent),
        data: { roles: ['admin', 'support', 'end_user'] },
      },
      {
        path: 'tickets',
        canActivate: [roleGuard('admin', 'support', 'end_user')],
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
        data: { title: 'Tickets', roles: ['admin', 'support', 'end_user'] },
      },
      {
        path: 'users',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
        data: { title: 'Users', roles: ['admin'] },
      },
      {
        path: 'settings',
        canActivate: [roleGuard('admin')],
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
        data: { title: 'Settings', roles: ['admin'] },
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./pages/forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
      },
    ],
  },
];
