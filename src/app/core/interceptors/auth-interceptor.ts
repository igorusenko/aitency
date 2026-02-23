import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, concatMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {CsrfStore} from '../stores/csrf.store';
import {CsrfService} from '../services/management-system/csrf/csrf.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfStore = inject(CsrfStore);
  const csrfService = inject(CsrfService);
  const router = inject(Router);
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
       catchError(authErrorHandler(router))
       )
  }
  else
  return next(req).pipe(
    catchError(authErrorHandler(router))
  );
};

export const authErrorHandler =
  (router: Router) =>
    (error: HttpErrorResponse) => {

      if (error.status === 401) {
        // router.navigate(['/login']);
      }

      return throwError(() => error);
    };
