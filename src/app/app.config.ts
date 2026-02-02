import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from '@angular/common/http';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import {CustomPreset} from '../theme';
import {authInterceptor} from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
      }
    })
  ]
};
