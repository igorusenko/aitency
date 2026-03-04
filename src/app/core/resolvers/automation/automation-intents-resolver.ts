import {ResolveFn} from '@angular/router';
import {IAutomation} from '../../interfaces/automations/automation-interface';
import {inject} from '@angular/core';
import {AutomationAdminService} from '../../services/management-system/automation/automation-admin.service';

export const automationIntentsResolver: ResolveFn<IAutomation | boolean> = (route, state) => {
  const automationService = inject(AutomationAdminService);
  return automationService.getAutomationIntents(route.params['id'])
}
