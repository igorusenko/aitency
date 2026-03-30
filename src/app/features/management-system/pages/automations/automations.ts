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
import {UserStore} from '../../../../core/stores/user.store';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'app-automations',
  imports: [CommonModule, FormsModule, TableModule, RouterLink, Button, ProgressSpinner],
  standalone: true,
  templateUrl: './automations.html',
  styleUrl: './automations.scss',
})
export class Automations implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  automationAdminService = inject(AutomationAdminService);
  automationAdminStore = inject(AutomationsStore);
  messageService = inject(MessageService);
  userStore = inject(UserStore);

  loading: boolean = false;
  first: number = 1;
  rows: number = 10;
  totalRecords = this.automationAdminStore.automations()?.totalCount;

  constructor() {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadData({first: 0, rows: this.rows});
  }

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
    this.loading = true;
    this.first = event.first;
    this.rows = event.rows;

    const page = (event.first / event.rows) + 1;
    const count = event.rows;

    this.automationAdminService.getAutomations(page, count).subscribe({
      next: (x) => {
        this.totalRecords = x.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading automations:', error);
        this.loading = false;
      }
    })
  }
}
