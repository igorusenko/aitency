import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../services/management-system/user/user.service';
import {Observable} from 'rxjs';

export const userResolver: ResolveFn<Observable<any> | boolean> = (route, state) => {
  if (route.params['id'] === 'new') return true;
  const userService = inject(UserService);
  return userService.getUserById(route.params['id']);
};
