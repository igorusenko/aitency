import {Injectable, signal, WritableSignal} from '@angular/core';
import {IPaginatedList} from '../interfaces/paginated-list-interface';
import {IAutomation} from '../interfaces/automations/automation-interface';

@Injectable({
  providedIn: 'root',
})
export class AutomationsStore {
  automations: WritableSignal<IPaginatedList<IAutomation> | undefined> = signal(undefined);
}
