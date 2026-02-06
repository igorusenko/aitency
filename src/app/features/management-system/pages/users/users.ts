import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {TableModule, TableRowSelectEvent} from 'primeng/table';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserStore} from '../../../../core/services/admin/user/user.store';
import {DatePipe} from '@angular/common';
import {UserService} from '../../../../core/services/admin/user/user.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-users',
  imports: [
    Button,
    TableModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  router = inject(Router);
  route = inject(ActivatedRoute);
  usersStore = inject(UserStore);
  userService = inject(UserService);
  messageService = inject(MessageService);

  selectRow(row: TableRowSelectEvent) {
    this.router.navigate([row.data.id], {relativeTo: this.route});
  }

  deleteUser(userId: string): void {
      this.userService.deleteUser(userId).subscribe(x => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Deleted Successfully!', life: 2000 });
        this.userService.getUsers().subscribe(x => {})
      });
  }
}
