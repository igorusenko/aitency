import {Component, inject} from '@angular/core';
import {UserStore} from '../../../../../core/services/admin/user/user.store';
import {Menu} from 'primeng/menu';
import {Panel} from 'primeng/panel';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-user-details',
  imports: [
    Menu,
    Panel,
    DatePipe
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails {
  readonly userStore = inject(UserStore);

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
