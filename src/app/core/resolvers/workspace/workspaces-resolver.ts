import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {WorkspacesService} from '../../services/management-system/workspaces/workspaces.service';

export const workspacesResolver: ResolveFn<Array<any>> = (route, state) => {
  const workspaceService = inject(WorkspacesService);
  return workspaceService.getWorkspaces();
};
