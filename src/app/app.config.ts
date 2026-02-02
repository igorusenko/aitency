import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import {CustomPreset} from '../theme';
import {authInterceptor} from './core/interceptors/auth-interceptor';
import {firstValueFrom, tap} from 'rxjs';
import {environment} from '../environments/environment';
import {CsrfStore} from './core/services/csrf.store';

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
    }),
    provideAppInitializer(() => {
      const http = inject(HttpClient)
      const csrfStore = inject(CsrfStore);
      return firstValueFrom(
        http
          .get(`${environment.apiUrl}/auth/csrf-token`)
          .pipe(tap((data: any) => {
            csrfStore.csrfToken.set(data.token)
          }))
      );
    })
  ]
};
