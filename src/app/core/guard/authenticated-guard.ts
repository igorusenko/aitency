import {CanActivateChildFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/management-system/auth/auth.service';
import {catchError, of} from 'rxjs';

export const isAuthenticatedGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.validateAccessToken().pipe(catchError((err: any) => {
    if (err.status === 401)
      router.navigate(['/login']);
    return of(false);
  }));
};
