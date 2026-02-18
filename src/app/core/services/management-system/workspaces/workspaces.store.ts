import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class WorkspacesStore {
  workspace: WritableSignal<any> = signal(undefined);
  workspaces: WritableSignal<any> = signal(undefined);
  workspaceById: WritableSignal<any> = signal(undefined);
}
