import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import {CustomPreset} from '../theme';
import {authInterceptor} from './core/interceptors/auth-interceptor';
import {CsrfService} from './core/services/admin/csrf/csrf.service';
import {catchError, concatMap, of} from 'rxjs';
import {UserService} from './core/services/admin/user/user.service';
import {MessageService} from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    MessageService,
    providePrimeNG({
      theme: {
        preset: CustomPreset,
      }
    }),
    provideAppInitializer(() => {
      const csrfService = inject(CsrfService);
      const userService = inject(UserService);
      return csrfService.loadCsrfToken()
        .pipe(
          concatMap(() => userService.getCurrentUser()),
          catchError(( ) => of(null))
        )
    })
  ]
};
