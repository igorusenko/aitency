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
      messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 2000 });
      if (error.status === 401)
        router.navigate(['/login']);
      return throwError(() => error);
    };
