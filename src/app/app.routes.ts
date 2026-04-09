import { Routes } from '@angular/router';
import {isAuthenticatedGuard} from './core/guard/authenticated-guard';
import {roleChildGuard, roleGuard} from './core/guard/role.guard';

const loadLayout = () =>
  import('./layout/layout').then((m) => m.Layout);

export const routes: Routes = [
  {
    path: '',
    loadComponent: loadLayout,
    canActivateChild: [isAuthenticatedGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'demo/:id',
        title: 'AITENCY Voice Agent',
        loadComponent: () =>
          import('./features/voice-assistant/voice-assistant').then(
            (m) => m.VoiceAssistant
          ),
        data: { roles: ['Default', 'Admin', 'Demo'] },
        canActivate: [roleGuard]
      },
      {
        path: 'home',
        title: 'AITENCY Voice Agent',
        loadComponent: () =>
          import('./features/management-system/pages/home/home').then((m) => m.Home),
        data: { roles: ['Default', 'Admin', 'Demo'] },
        canActivate: [roleGuard]
      },
      {
        path: 'automations',
        title: 'AITENCY Voice Agent',
        data: { roles: ['Default', 'Admin', 'Demo'] },
        canActivate: [roleGuard],
        canActivateChild: [roleChildGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/management-system/pages/automations/automations').then((m) => m.Automations),
            data: { roles: ['Default', 'Admin', 'Demo'] }
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/management-system/pages/automations/automation-details/automation-details').then((m) => m.AutomationDetails),
            data: { roles: ['Default', 'Admin', 'Demo'] }
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/management-system/pages/automations/automation-edit/automation-edit').then((m) => m.AutomationEdit),
            data: { roles: ['Default', 'Admin', 'Demo'] }
          }
        ]
      },
      {
        path: 'users',
        title: 'AITENCY Voice Agent',
        data: { roles: ['Admin'] },
        canActivate: [roleGuard],
        canActivateChild: [roleChildGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/management-system/pages/users/users').then((m) => m.Users),
            data: { roles: ['Admin'] }
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/management-system/pages/users/user-details/user-details').then((m) => m.UserDetails),
            data: { roles: ['Admin'] }
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./features/management-system/pages/users/user-edit/user-edit').then((m) => m.UserEdit),
            data: { roles: ['Admin'] }
          }
        ]
      },
      {
        path: 'billing',
        title: 'AITENCY Voice Agent',
        data: { roles: ['Default', 'Admin'] },
        canActivate: [roleGuard],
        canActivateChild: [roleChildGuard],
        children: [
          {
            path: 'overview',
            loadComponent: () =>
              import('./features/management-system/pages/billing/overview/overview').then((m) => m.BillingOverview),
            data: { roles: ['Default'] }
          },
          {
            path: 'invoices',
            loadComponent: () =>
              import('./features/management-system/pages/billing/invoices/invoices').then((m) => m.Invoices),
            data: { roles: ['Default', 'Admin', 'Demo'] }
          },
          {
            path: 'payments',
            loadComponent: () =>
              import('./features/management-system/pages/billing/payments/payments').then((m) => m.Payments),
            data: { roles: ['Default', 'Admin', 'Demo'] }
          },
          {
            path: 'subscriptions',
            loadComponent: () =>
              import('./features/management-system/pages/billing/subscriptions/subscriptions').then((m) => m.Subscriptions),
            data: { roles: ['Default', 'Demo'] }
          },
          {
            path: 'usage',
            loadComponent: () =>
              import('./features/management-system/pages/billing/usage/usage').then((m) => m.Usage),
            data: { roles: ['Default'] }
          },
          {
            path: 'plans',
            loadComponent: () =>
              import('./features/management-system/pages/billing/plans/plans').then((m) => m.Plans),
            data: { roles: ['Admin'] }
          },
          {
            path: 'coupons',
            loadComponent: () =>
              import('./features/management-system/pages/billing/coupons/coupons').then((m) => m.Coupons),
            data: { roles: ['Admin'] }
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/management-system/pages/billing/settings/settings').then((m) => m.Settings),
            data: { roles: ['Default', 'Demo'] }
          }
        ]
      },
      {
        path: 'onboarding',
        title: 'Onboarding',
        loadComponent: () =>
          import('./features/management-system/onboarding/onboarding').then((m) => m.Onboarding),
        data: { roles: ['Default', 'Admin'] },
        canActivate: [roleGuard]
      },
    ]
  },
  {
    path: 'demo-auth',
    title: 'Demo Authorization',
    loadComponent: () =>
      import('./features/management-system/pages/demo-auth/demo-auth').then(
        (m) => m.DemoAuth
      ),
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./features/management-system/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Register',
    loadComponent: () =>
      import('./features/management-system/pages/register/register').then((m) => m.Register),
  },
  {
    path: 'confirm-email',
    title: 'Create password',
    loadComponent: () =>
      import('./features/management-system/pages/register/create-password/create-password').then((m) => m.CreatePassword),
  },
  {
    path: 'forgot-password',
    title: 'Forgot password',
    loadComponent: () =>
      import('./features/management-system/pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'reset-password',
    title: 'Reset password',
    loadComponent: () =>
      import('./features/management-system/pages/register/create-password/create-password').then((m) => m.CreatePassword),
  }
  ,
  // Top-level wildcard 404 should be the very last route
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () =>
      import('./features/misc/not-found/not-found').then((m) => m.NotFound)
  }
];
