import {CanActivateFn, CanActivateChildFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {UserStore} from '../stores/user.store';
import {MessageService} from 'primeng/api';

function checkRole(allowed: string[] | undefined): boolean | UrlTree {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const role: string | undefined = userStore.userRole ?? userStore.userRole;

  if (!allowed || allowed.length === 0) {
    return true;
  }

  if (role && allowed.includes(role)) {
    return true;
  }

  // Show error message and redirect to home if role not allowed
  messageService.add({
    severity: 'error',
    summary: 'Access denied',
    detail: 'You do not have permission to view this page.'
  });
  return router.parseUrl('/home');
}

export const roleGuard: CanActivateFn = (route) => {
  const allowed = route.data?.['roles'] as string[] | undefined;
  return checkRole(allowed);
};

export const roleChildGuard: CanActivateChildFn = (childRoute) => {
  const allowed = childRoute.data?.['roles'] as string[] | undefined;
  return checkRole(allowed);
};
