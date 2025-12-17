import { Routes } from '@angular/router';

const loadLayout = () =>
  import('./layout/layout').then((m) => m.Layout);

export const routes: Routes = [
  {
    path: '',
    loadComponent: loadLayout,
    children: [
      {
        path: 'home',
        title: 'Home',
        loadComponent: () =>
          import('./pages/home/home').then((m) => m.Home),
      }
    ]
  }
];
