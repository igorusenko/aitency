import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  currentUser: WritableSignal<any> = signal(undefined);
}
