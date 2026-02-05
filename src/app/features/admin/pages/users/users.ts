import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {TableModule, TableRowSelectEvent} from 'primeng/table';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserStore} from '../../../../core/services/admin/user/user.store';

@Component({
  selector: 'app-users',
  imports: [
    Button,
    TableModule,
    RouterLink
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  router = inject(Router);
  route = inject(ActivatedRoute);
  usersStore = inject(UserStore);

  selectRow(row: TableRowSelectEvent) {
    this.router.navigate([row.data.id], {relativeTo: this.route});
  }

  deleteUser(userId: string): void {}
}
