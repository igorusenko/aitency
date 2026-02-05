import { ResolveFn } from '@angular/router';
import {IAutomation} from '../../interfaces/automations/automation-interface';
import {inject} from '@angular/core';
import {AutomationAdminService} from '../../services/admin/automation/automation-admin.service';

export const automationInfoAdminResolver: ResolveFn<IAutomation | null> = (route, state) => {
  const automationAdminService = inject(AutomationAdminService);
  if (route.params['id'] === 'new') return null;
  else return automationAdminService.getAutomationAdmin(route.params['id']);
};
