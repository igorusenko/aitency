import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../services/admin/user/user.service';

export const usersResolver: ResolveFn<any> = (route, state) => {
  const userService = inject(UserService);
  return userService.getUsers();
};
