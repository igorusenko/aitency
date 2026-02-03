import { Routes } from '@angular/router';

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
