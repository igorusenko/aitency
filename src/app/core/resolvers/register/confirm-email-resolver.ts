import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/admin/auth/auth.service';

export const confirmEmailResolver: ResolveFn<boolean> = (route, state) => {
  const authService = inject(AuthService);
  return authService.verifyPassword(route.queryParams['token']);
};
