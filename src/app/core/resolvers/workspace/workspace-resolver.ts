import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {WorkspacesService} from '../../services/management-system/workspaces/workspaces.service';

export const workspaceResolver: ResolveFn<boolean> = (route, state) => {
  if (route.params['id'] === 'new') return true;
  const workspaceService = inject(WorkspacesService);
  return workspaceService.getWorkspaceById(route.params['id']);
};
