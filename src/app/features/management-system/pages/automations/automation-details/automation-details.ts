import {Component, inject, OnInit} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {Menu} from 'primeng/menu';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {map} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {UserStore} from '../../../../../core/services/management-system/user/user.store';
import {
  AutomationAdminService
} from '../../../../../core/services/management-system/automation/automation-admin.service';
import {AsyncPipe, DatePipe} from '@angular/common';
import {Paginator} from 'primeng/paginator';

@Component({
  selector: 'app-automation-details',
  imports: [PanelModule, ReactiveFormsModule, Menu, RouterLink, DatePipe, Paginator],
  templateUrl: './automation-details.html',
  styleUrl: './automation-details.scss',
})
export class AutomationDetails implements OnInit {
  automationAdminService = inject(AutomationAdminService);
  userStore = inject(UserStore);
  automation = toSignal(
    inject(ActivatedRoute).data.pipe(
      map(data => data['automation'])
    )
  );
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
    this.getLogs();
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
