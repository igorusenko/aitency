import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WorkspacesStore} from '../../../stores/workspaces.store';
import {environment} from '../../../../../environments/environment';
import {Observable, tap} from 'rxjs';
import {IPaginatedList} from '../../../interfaces/paginated-list-interface';
import {IWorkspace} from '../../../interfaces/workspace/workspace.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkspacesService {
  private readonly http = inject(HttpClient);
  private readonly workspacesStore = inject(WorkspacesStore);
  private readonly apiUrl = environment.apiUrl;

  getWorkspaces(): Observable<IPaginatedList<IWorkspace>> {
    return this.http.get<IPaginatedList<IWorkspace>>(`${this.apiUrl}/workspaces`)
      .pipe(tap(workspaces => this.workspacesStore.workspaces.set(workspaces)));
  }

  getWorkspaceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/workspaces/${id}`)
      .pipe(tap(workspace => this.workspacesStore.workspace.set(workspace)));
  }

  appendWorkspace(automationId: string, workspaceIds: string[]) {
    return this.http.patch<any>(`${this.apiUrl}/automations/workspaces/append`, {automationId, workspaceIds})
  }

  detachWorkspace(automationId: string, workspaceIds: string[]) {
    return this.http.patch<any>(`${this.apiUrl}/automations/workspaces/detach`, {automationId, workspaceIds})
  }
}
