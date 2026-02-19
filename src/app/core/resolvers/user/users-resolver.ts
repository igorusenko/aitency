import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../services/management-system/user/user.service';

export const usersResolver: ResolveFn<any> = (route, state) => {
  const userService = inject(UserService);
  return userService.getUsers(1, 5);
};
