import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {AutomationAdminService} from '../../services/management-system/automation/automation-admin.service';
import {IPaginatedList} from '../../interfaces/paginated-list-interface';
import {IAutomation} from '../../interfaces/automations/automation-interface';
import {AutomationUserService} from '../../services/management-system/automation/automation-user.service';
import {UserStore} from '../../services/management-system/user/user.store';

export const automationsResolver: ResolveFn<IPaginatedList<IAutomation>> = (route, state) => {
  const automationAdminService = inject(AutomationAdminService);
  const automationUserService = inject(AutomationUserService);
  const userStore = inject(UserStore);

  if (userStore.currentUser().role === 'Admin')
  return automationAdminService.getAutomations();
  else return automationUserService.getAutomations();
};
