import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/overview/overview.component').then((m) => m.OverviewComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
        data: { title: 'Projects' },
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
        data: { title: 'Tickets' },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
        data: { title: 'Users' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/placeholder/placeholder.component').then((m) => m.PlaceholderComponent),
        data: { title: 'Settings' },
      },
    ],
  },
];
