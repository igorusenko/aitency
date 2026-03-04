import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {IAutomation} from '../../interfaces/automations/automation-interface';
import {UserStore} from '../../stores/user.store';
import {AutomationAdminService} from '../../services/management-system/automation/automation-admin.service';
import {concatMap} from 'rxjs';

export const automationResolver: ResolveFn<IAutomation | boolean> = (route, state) => {
  if (route.params['id'] === 'new') return true;

  const automationAdminService = inject(AutomationAdminService);
  const userStore = inject(UserStore);
  let req;
  if (userStore.currentUser().role === 'Admin')
    req = automationAdminService.getAutomationAdmin(route.params['id'])
  else req = automationAdminService.getAutomationUser(route.params['id']);
  
  return automationAdminService.getAutomationIntents(route.params['id'])
    .pipe(concatMap(() => req));
};
