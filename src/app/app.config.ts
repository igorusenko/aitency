import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter, Router} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import {CustomPreset} from '../theme';
import {authInterceptor} from './core/interceptors/auth-interceptor';
import {CsrfService} from './core/services/management-system/csrf/csrf.service';
import {catchError, concatMap, of} from 'rxjs';
import {UserService} from './core/services/management-system/user/user.service';
import {MessageService} from 'primeng/api';
import {AuthService} from './core/services/management-system/auth/auth.service';
import {provideNgxStripe} from 'ngx-stripe';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNgxStripe(environment.stripePublishableKey),
    MessageService,
    providePrimeNG({
      theme: {
        options: {
          darkModeSelector: '.dark'
        },
        preset: CustomPreset,
      }
    }),
    provideAppInitializer(() => {
      const csrfService = inject(CsrfService);
      const userService = inject(UserService);
      const authService = inject(AuthService);
      const router = inject(Router);
      return csrfService.loadCsrfToken()
        .pipe(
          concatMap(() => authService.validateAccessToken()),
          concatMap(() => userService.getCurrentUser()),
          catchError(() => {
            // Allow unauthenticated access to public routes (no redirect to /login)
            const publicPaths = [
              '/login',
              '/register',
              '/confirm-email',
              '/reset-password',
              '/forgot-password',
              '/demo-auth'
            ];
            // На ранней инициализации router.url может быть '/', используем фактический путь окна
            const currentPath = typeof window !== 'undefined' && window.location ? window.location.pathname : '';
            const isPublic = publicPaths.some((p) => currentPath.startsWith(p));
            if (!isPublic) {
              router.navigate(['/login']);
            }
            return of(null);
          })
        )
    })
  ]
};
