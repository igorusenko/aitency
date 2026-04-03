import {Component, inject, OnInit} from '@angular/core';
import {UserStore} from '../../../../../core/stores/user.store';
import {Menu} from 'primeng/menu';
import {Panel} from 'primeng/panel';
import {AsyncPipe, DatePipe, JsonPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../../../../core/services/management-system/user/user.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-details',
  imports: [
    Menu,
    Panel,
    DatePipe,
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit {
  readonly userStore = inject(UserStore);
  readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  userPassword$: Observable<{password: string}>;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.userService.getUserById(id).subscribe(() => {
        this.userPassword$ = this.userService.getUserPassword();
      });
    }
  }

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
