import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AutomationAdminService} from '../../../../core/services/management-system/automation/automation-admin.service';
import {TableModule, TableRowSelectEvent} from 'primeng/table';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {IPaginatedList} from '../../../../core/interfaces/paginated-list-interface';
import {IAutomation} from '../../../../core/interfaces/automations/automation-interface';
import {Observable, skip, skipLast} from 'rxjs';
import {Button} from 'primeng/button';
import {MessageService} from 'primeng/api';
import {AutomationsStore} from '../../../../core/stores/automations.store';
import {UserStore} from '../../../../core/services/management-system/user/user.store';

@Component({
  selector: 'app-automations',
  imports: [CommonModule, FormsModule, TableModule, RouterLink, Button],
  standalone: true,
  templateUrl: './automations.html',
  styleUrl: './automations.scss',
})
export class Automations {
  router = inject(Router);
  route = inject(ActivatedRoute);
  automationAdminService = inject(AutomationAdminService);
  automationAdminStore = inject(AutomationsStore);
  messageService = inject(MessageService);
  userStore = inject(UserStore);


  first: number = 1;
  rows: number = 10;
  totalRecords = this.automationAdminStore.automations()?.totalCount;

  constructor() {}

  selectRow(row: TableRowSelectEvent) {
    this.router.navigate([row.data.id], {relativeTo: this.route});
  }

  deleteAutomation(id: string) {
    this.automationAdminService.deleteAutomation(id).subscribe(x => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Automation Deleted Successfully!', life: 2000 });
      this.loadData({first: this.first, rows: this.rows});
    });
  }

  loadData(event: any): void {
    this.first = event.first;
    this.rows = event.rows;

    const page = (event.first / event.rows) + 1;
    const count = event.rows;

    this.automationAdminService.getAutomations(page, count).subscribe(x => {
      this.totalRecords = x.totalCount;
    })
  }
}
