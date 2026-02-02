import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {catchError, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {CsrfStore} from '../services/csrf.store';
import {CsrfService} from '../services/csrf.service';

const SKIP_AUTH_URLS = ['/auth/login', '/auth/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfStore = inject(CsrfStore);
  const csrfService = inject(CsrfService);
  const router = inject(Router);

  req = req.clone({ withCredentials: true });

  if (['POST','PUT','DELETE','PATCH'].includes(req.method)) {
    const token = csrfStore.csrfToken();
    if (token.length > 0) {
      req = req.clone({
        headers: req.headers.set('X-CSRF-TOKEN', token),
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        router.navigate(['/login']);
        csrfService.loadCsrfToken().then((data: any) => {
          csrfStore.csrfToken.set(data.token);
        });
      }
      return throwError(() => error);
    })
  );
};
