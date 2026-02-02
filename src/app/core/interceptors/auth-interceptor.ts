import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {catchError, throwError} from 'rxjs';
import {Router} from '@angular/router';

const SKIP_AUTH_URLS = ['/auth/login', '/auth/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // пропускаем публичные эндпоинты
  if (SKIP_AUTH_URLS.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = authService.getToken();

  const authReq = token
    ? req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
    : req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 = токен истёк или невалидный
      if (error.status === 401) {
        // чистим токен из сервиса
        authService.clearToken();
        // редирект на login
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
