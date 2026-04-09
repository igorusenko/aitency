import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, concatMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {CsrfStore} from '../stores/csrf.store';
import {CsrfService} from '../services/management-system/csrf/csrf.service';
import {MessageService} from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfStore = inject(CsrfStore);
  const csrfService = inject(CsrfService);
  const router = inject(Router);
  const messageService = inject(MessageService)
  req = req.clone({ withCredentials: true });
  if (['POST','PUT','DELETE','PATCH'].includes(req.method)) {
   return csrfService.loadCsrfToken()
     .pipe(
       concatMap(() => {
       req = req.clone({
         headers: req.headers.set('X-CSRF-TOKEN', csrfStore.csrfToken()),
       });
      return next(req)
     }),
       catchError(authErrorHandler(router, messageService))
       )
  }
  else
  return next(req).pipe(
    catchError(authErrorHandler(router, messageService))
  );
};

export const authErrorHandler =
  (router: Router, messageService: MessageService) =>
    (error: HttpErrorResponse) => {
      const publicPaths = [
        '/login',
        '/register',
        '/confirm-email',
        '/reset-password',
        '/forgot-password',
        '/demo-auth'
      ];

      // В момент инициализации router.url может быть '/', используем реальный URL окна
      const currentPath = typeof window !== 'undefined' && window.location ? window.location.pathname : '';
      const isPublic = publicPaths.some((p) => currentPath.startsWith(p));

      // Не шумим тостом для ожидаемых 401 на публичных страницах
      if (!(error.status === 401 && isPublic)) {
        messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.message ?? 'Request failed', life: 2000 });
      }

      if (error.status === 401 && !isPublic) {
        router.navigate(['/login']);
      }

      return throwError(() => error);
    };
