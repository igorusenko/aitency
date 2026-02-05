import { Routes } from '@angular/router';
import {automationInfoUserResolver} from './core/resolvers/user/automation-info-user-resolver';

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
          import('./features/admin/pages/home/home').then((m) => m.Home),
      },
      {
        path: 'automations',
        title: 'Automations',
        loadComponent: () =>
          import('./features/admin/pages/automations/automations').then((m) => m.Automations),
      },
      {
        path: 'automations/:id',
        title: 'Automation details',
        loadComponent: () =>
          import('./features/admin/pages/automations/automation-details/automation-details').then((m) => m.AutomationDetails),
        resolve: {automation: automationInfoUserResolver}
      },
      {
        path: 'automations/edit/:id',
        title: 'Automation edit',
        loadComponent: () =>
          import('./features/admin/pages/automations/automation-edit/automation-edit').then((m) => m.AutomationEdit),
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () =>
          import('./features/admin/pages/users/users').then((m) => m.Users),
      }
    ]
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./features/admin/pages/login/login').then((m) => m.Login),
  }
];
