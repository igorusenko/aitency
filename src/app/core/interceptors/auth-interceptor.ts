import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, from, switchMap, throwError} from 'rxjs';
import {CsrfService} from '../services/csrf.service';
import {CsrfStore} from '../services/csrf.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfStore = inject(CsrfStore);
  const csrfService = inject(CsrfService);
  const router = inject(Router);

  req = req.clone({ withCredentials: true });

  const handleRequest = (request: typeof req) =>
    next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          router.navigate(['/login']);
          csrfService.loadCsrfToken().then(() => {
            const t = csrfService.token;
            if (t) csrfStore.csrfToken.set(t);
          });
        }
        return throwError(() => error);
      })
    );

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = csrfStore.csrfToken();
    if (token) {
      req = req.clone({
        headers: req.headers.set('X-CSRF-TOKEN', token),
      });
      return handleRequest(req);
    }
    return from(csrfService.loadCsrfToken()).pipe(
      switchMap(() => {
        const newToken = csrfService.token;
        if (newToken) {
          csrfStore.csrfToken.set(newToken);
          req = req.clone({
            headers: req.headers.set('X-CSRF-TOKEN', newToken),
          });
        }
        return handleRequest(req);
      })
    );
  }

  return handleRequest(req);
};
