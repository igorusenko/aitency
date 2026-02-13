import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/management-system/auth/auth.service';

export const confirmResetPasswordResolver: ResolveFn<boolean> = (route, state) => {
  const authService = inject(AuthService);
  return authService.verifyResetPassword(route.queryParams['token']);
};
