import {Component, inject, OnInit} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {Menu} from 'primeng/menu';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, DatePipe} from '@angular/common';
import {Paginator} from 'primeng/paginator';
import {AutomationsStore} from '../../../../../core/stores/automations.store';
import {
  AutomationAdminService
} from '../../../../../core/services/management-system/automation/automation-admin.service';
import {UserStore} from '../../../../../core/stores/user.store';
import {IAutomation} from '../../../../../core/interfaces/automations/automation-interface';

@Component({
  selector: 'app-automation-details',
  imports: [PanelModule, ReactiveFormsModule, Menu, RouterLink, DatePipe, Paginator, AsyncPipe],
  templateUrl: './automation-details.html',
  styleUrl: './automation-details.scss',
})
export class AutomationDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  automationAdminService = inject(AutomationAdminService);
  automationStore = inject(AutomationsStore);
  userStore = inject(UserStore);

  automation: IAutomation | null = null;
  automationLogs: any;

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

  logsPaginator = {
    page: 1,
    count: 10,
    first: 0,
    totalRecords: 0
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    if (this.userStore.currentUser().role === 'Admin') {
      this.automationAdminService.getAutomationAdmin(id).subscribe(automation => {
        this.automation = automation;
        this.getLogs();
      });
    } else {
      this.automationAdminService.getAutomationUser(id).subscribe(automation => {
        this.automation = automation;
        if (this.userStore.currentUser().role !== 'Demo') {
          this.getLogs();
        }
      });
    }
  }

  getLogs(): void {
    this.automationAdminService.getLogs(this.logsPaginator.page, this.logsPaginator.count).subscribe(logs => {
      this.automationLogs = logs;
      this.logsPaginator.totalRecords = logs.totalCount;
    })
  }

  onPageChange(event: any): void {
    const page = (event.first / event.rows) + 1;
    const count = event.rows;
    this.logsPaginator.page = page;
    this.logsPaginator.count = count;
    this.getLogs();
  }

}
