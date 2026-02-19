import {Component, inject} from '@angular/core';
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
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-automation-details',
  imports: [PanelModule, ReactiveFormsModule, Menu, RouterLink, AsyncPipe],
  templateUrl: './automation-details.html',
  styleUrl: './automation-details.scss',
})
export class AutomationDetails {
  automationAdminService = inject(AutomationAdminService);
  userStore = inject(UserStore);
  automation = toSignal(
    inject(ActivatedRoute).data.pipe(
      map(data => data['automation'])
    )
  );
  automationLogs$ = this.automationAdminService.getLogs();
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
  protected readonly JSON = JSON;
}
