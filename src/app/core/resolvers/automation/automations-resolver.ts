import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {AutomationAdminService} from '../../services/management-system/automation/automation-admin.service';
import {IPaginatedList} from '../../interfaces/paginated-list-interface';
import {IAutomation} from '../../interfaces/automations/automation-interface';

export const automationsResolver: ResolveFn<IPaginatedList<IAutomation>> = (route, state) => {
  const automationAdminService = inject(AutomationAdminService);
  return automationAdminService.getAutomations();
};
