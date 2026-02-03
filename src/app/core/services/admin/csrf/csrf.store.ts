import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CsrfStore {
  csrfToken: WritableSignal<string> = signal('');
}
