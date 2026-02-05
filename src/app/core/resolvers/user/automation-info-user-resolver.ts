import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {AutomationUserService} from '../../services/user/automation-user.service';
import {IAutomation} from '../../interfaces/automations/automation-interface';

export const automationInfoUserResolver: ResolveFn<IAutomation> = (route, state) => {
  const automationUserService = inject(AutomationUserService);
  return automationUserService.getAutomationUser(route.params['id']);
};
