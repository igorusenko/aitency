import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {WorkspacesService} from '../../services/management-system/workspaces/workspaces.service';
import {IPaginatedList} from '../../interfaces/paginated-list-interface';
import {IWorkspace} from '../../interfaces/workspace/workspace.interface';

export const workspacesResolver: ResolveFn<IPaginatedList<IWorkspace>> = (route, state) => {
  const workspaceService = inject(WorkspacesService);
  return workspaceService.getWorkspaces();
};
