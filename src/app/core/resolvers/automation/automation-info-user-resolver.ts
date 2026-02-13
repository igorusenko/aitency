import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {AutomationUserService} from '../../services/management-system/automation/automation-user.service';
import {IAutomation} from '../../interfaces/automations/automation-interface';
import {UserService} from '../../services/management-system/user/user.service';
import {UserStore} from '../../services/management-system/user/user.store';
import {AutomationAdminService} from '../../services/management-system/automation/automation-admin.service';

export const automationResolver: ResolveFn<IAutomation | boolean> = (route, state) => {
  if (route.params['id'] === 'new') return true
  const automationUserService = inject(AutomationUserService);
  const automationAdminService = inject(AutomationAdminService);
  const userStore = inject(UserStore);
  if (userStore.currentUser().role === 'Admin')
    return automationAdminService.getAutomationAdmin(route.params['id']);
  else return automationUserService.getAutomationUser(route.params['id']);
};
