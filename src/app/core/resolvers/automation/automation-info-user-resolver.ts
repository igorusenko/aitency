import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {IAutomation} from '../../interfaces/automations/automation-interface';
import {UserStore} from '../../stores/user.store';
import {AutomationAdminService} from '../../services/management-system/automation/automation-admin.service';

export const automationResolver: ResolveFn<IAutomation | boolean> = (route, state) => {
  if (route.params['id'] === 'new') return true
  const automationAdminService = inject(AutomationAdminService);
  const userStore = inject(UserStore);
  if (userStore.currentUser().role === 'Admin')
    return automationAdminService.getAutomationAdmin(route.params['id']);
  else return automationAdminService.getAutomationUser(route.params['id']);
};
