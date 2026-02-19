import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {TableModule, TableRowSelectEvent} from 'primeng/table';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UserStore} from '../../../../core/services/management-system/user/user.store';
import {DatePipe, NgClass, UpperCasePipe} from '@angular/common';
import {UserService} from '../../../../core/services/management-system/user/user.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-users',
  imports: [
    Button,
    TableModule,
    RouterLink,
    UpperCasePipe,
    NgClass
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

  first: number = 1;
  rows: number = 10;
  totalRecords = this.usersStore.users()?.totalCount;

  selectRow(row: TableRowSelectEvent) {
    this.router.navigate([row.data.id], {relativeTo: this.route});
  }

  deleteUser(userId: string): void {
      this.userService.deleteUser(userId).subscribe(x => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Deleted Successfully!', life: 2000 });
        this.loadData({first: this.first, rows: this.rows});
      });
  }

  loadData(event: any): void {
    this.first = event.first;
    this.rows = event.rows;

    const page = (event.first / event.rows) + 1;
    const count = event.rows;

    this.userService.getUsers(page, count).subscribe(x => {
      this.totalRecords = x.totalCount;
    })
  }
}
