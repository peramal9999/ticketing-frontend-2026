import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'profile' },
  {
    path: 'profile',
    loadComponent: () =>
      import('./account-settings/account-settings.component').then((m) => m.AccountSettingsComponent),
  },
];
