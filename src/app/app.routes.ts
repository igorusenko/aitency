import { Routes } from '@angular/router';
import {automationsResolver} from './core/resolvers/automation/automations-resolver';
import {automationResolver} from './core/resolvers/automation/automation-info-user-resolver';
import {usersResolver} from './core/resolvers/user/users-resolver';
import {userResolver} from './core/resolvers/user/user-resolver';
import {confirmEmailResolver} from './core/resolvers/register/confirm-email-resolver';
import {confirmResetPasswordResolver} from './core/resolvers/register/confirm-reset-password-resolver';
import {isAuthenticatedGuard} from './core/guard/authenticated-guard';
import {workspacesResolver} from './core/resolvers/workspace/workspaces-resolver';
import {automationIntentsResolver} from './core/resolvers/automation/automation-intents-resolver';
import {analyticsResolver} from './core/resolvers/analytics/analytics-resolver';

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
        resolve: { intents: automationIntentsResolver }
      },
      {
        path: 'home',
        title: 'AITENCY Voice Agent',
        loadComponent: () =>
          import('./features/management-system/pages/home/home').then((m) => m.Home),
        resolve: {analytics: analyticsResolver},
      },
      {
        path: 'automations',
        title: 'AITENCY Voice Agent',
        loadComponent: () =>
          import('./features/management-system/pages/automations/automations').then((m) => m.Automations),
        resolve: {automations: automationsResolver}
      },
      {
        path: 'automations/:id',
        title: 'AITENCY Voice Agent',
        loadComponent: () =>
          import('./features/management-system/pages/automations/automation-details/automation-details').then((m) => m.AutomationDetails),
        resolve: {automation: automationResolver}
      },
      {
        path: 'automations/edit/:id',
        title: 'AITENCY Voice Agent',
        loadComponent: () =>
          import('./features/management-system/pages/automations/automation-edit/automation-edit').then((m) => m.AutomationEdit),
        resolve: {automation: automationResolver, workspaces: workspacesResolver}
      },
      {
        path: 'users',
        title: 'AITENCY Voice Agent',
        loadComponent: () =>
          import('./features/management-system/pages/users/users').then((m) => m.Users),
        resolve: {users: usersResolver}
      },
      {
        path: 'users/:id',
        title: 'AITENCY Voice Agent',
        loadComponent: () =>
          import('./features/management-system/pages/users/user-details/user-details').then((m) => m.UserDetails),
        resolve: {user: userResolver}
      },
      {
        path: 'users/edit/:id',
        title: 'AITENCY Voice Agent',
        loadComponent: () =>
          import('./features/management-system/pages/users/user-edit/user-edit').then((m) => m.UserEdit),
        resolve: {user: userResolver}
      }
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
    resolve: { verify: confirmEmailResolver }
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
    resolve: { verify: confirmResetPasswordResolver }
  },
  {
    path: 'onboarding',
    title: 'Onboarding',
    loadComponent: () =>
      import('./features/management-system/onboarding/onboarding').then((m) => m.Onboarding),
  },
];
