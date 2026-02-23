import {Component, inject} from '@angular/core';
import {UserStore} from '../../../../../core/stores/user.store';
import {Menu} from 'primeng/menu';
import {Panel} from 'primeng/panel';
import {AsyncPipe, DatePipe} from '@angular/common';
import {UserService} from '../../../../../core/services/management-system/user/user.service';

@Component({
  selector: 'app-user-details',
  imports: [
    Menu,
    Panel,
    DatePipe,
    AsyncPipe
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails {
  readonly userStore = inject(UserStore);
  readonly userService = inject(UserService);
  userPassword$ = this.userService.getUserPassword()
  items = [
    {
      label: 'Refresh',
      icon: 'pi pi-refresh'
    },
    {
      label: 'Search',
      icon: 'pi pi-search'
    },
    {
      separator: true
    },
    {
      label: 'Delete',
      icon: 'pi pi-times'
    }
  ]
}
