import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {IAutomation} from '../../../interfaces/automations/automation-interface';
import {environment} from '../../../../../environments/environment';
import {AutomationsStore} from '../../../stores/automations.store';
import {IPaginatedList} from '../../../interfaces/paginated-list-interface';
import {UserStore} from '../user/user.store';

@Injectable({
  providedIn: 'root',
})
export class AutomationUserService {
  private readonly http = inject(HttpClient);
  private readonly automationsStore = inject(AutomationsStore);
  private readonly userStore = inject(UserStore);
  private readonly apiUrl = environment.apiUrl;

  getAutomations(): Observable<IPaginatedList<IAutomation>> {
    return this.http.get<IPaginatedList<IAutomation>>(`${this.apiUrl}/automations?userId=${this.userStore.currentUser().id}`).pipe(
      tap(automationsList => this.automationsStore.automations.set(automationsList))
    );
  }

  getAutomationUser(id: string): Observable<IAutomation> {
    return this.http.get<IAutomation>(`${this.apiUrl}/automations/${id}`)
      .pipe(tap(x => this.automationsStore.automation.set(x)));
  }
}
