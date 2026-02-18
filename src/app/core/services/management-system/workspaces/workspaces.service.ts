import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WorkspacesStore} from './workspaces.store';
import {environment} from '../../../../../environments/environment';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkspacesService {
  private readonly http = inject(HttpClient);
  private readonly workspacesStore = inject(WorkspacesStore);
  private readonly apiUrl = environment.apiUrl;

  getWorkspaces(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/workspaces`)
      .pipe(tap(workspaces => this.workspacesStore.workspaces.set(workspaces)));
  }

  getWorkspaceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/workspaces/${id}`)
      .pipe(tap(workspace => this.workspacesStore.workspace.set(workspace)));
  }
}
