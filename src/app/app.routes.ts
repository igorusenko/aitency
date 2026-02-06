import { Routes } from '@angular/router';
import {automationsResolver} from './core/resolvers/automation/automations-resolver';
import {automationResolver} from './core/resolvers/automation/automation-info-user-resolver';
import {usersResolver} from './core/resolvers/user/users-resolver';
import {userResolver} from './core/resolvers/user/user-resolver';

const loadLayout = () =>
  import('./layout/layout').then((m) => m.Layout);

export const routes: Routes = [
  {
    path: '',
    loadComponent: loadLayout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'demo/:id',
        title: 'Demo',
        loadComponent: () =>
          import('./features/voice-assistant/voice-assistant').then(
            (m) => m.VoiceAssistant
          ),
      },
      {
        path: 'home',
        title: 'VoiceAssistant',
        loadComponent: () =>
          import('./features/management-system/pages/home/home').then((m) => m.Home),
      },
      {
        path: 'automations',
        title: 'Automations',
        loadComponent: () =>
          import('./features/management-system/pages/automations/automations').then((m) => m.Automations),
        resolve: {automations: automationsResolver}
      },
      {
        path: 'automations/:id',
        title: 'Automation details',
        loadComponent: () =>
          import('./features/management-system/pages/automations/automation-details/automation-details').then((m) => m.AutomationDetails),
        resolve: {automation: automationResolver}
      },
      {
        path: 'automations/edit/:id',
        title: 'Automation edit',
        loadComponent: () =>
          import('./features/management-system/pages/automations/automation-edit/automation-edit').then((m) => m.AutomationEdit),
        resolve: {automation: automationResolver}
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () =>
          import('./features/management-system/pages/users/users').then((m) => m.Users),
        resolve: {users: usersResolver}
      },
      {
        path: 'users/:id',
        title: 'User Details',
        loadComponent: () =>
          import('./features/management-system/pages/users/user-details/user-details').then((m) => m.UserDetails),
        resolve: {user: userResolver}
      },
      {
        path: 'users/edit/:id',
        title: 'User Edit',
        loadComponent: () =>
          import('./features/management-system/pages/users/user-edit/user-edit').then((m) => m.UserEdit),
        resolve: {user: userResolver}
      }
    ]
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./features/management-system/pages/login/login').then((m) => m.Login),
  }
];
