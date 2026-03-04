import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {IPaginatedList} from '../../../interfaces/paginated-list-interface';
import {IAutomation} from '../../../interfaces/automations/automation-interface';
import {UserService} from '../user/user.service';
import {AutomationsStore} from '../../../stores/automations.store';
import {IAppendUserModel} from '../../../interfaces/users/user';
import {UserStore} from '../../../stores/user.store';
import {ILogItem} from '../../../interfaces/logs/logs.interface';

@Injectable({
  providedIn: 'root',
})
export class AutomationAdminService {
  private readonly http = inject(HttpClient);
  private readonly automationsStore = inject(AutomationsStore);
  private readonly userStore = inject(UserStore);

  private readonly apiUrl = environment.apiUrl;

  getAutomations(page: number, count: number): Observable<IPaginatedList<IAutomation>> {
    let params = new HttpParams()
      .set('page', page)
      .set('count', count);

    if (this.userStore.currentUser().role !== 'Admin') {
      params = params.append('userId', this.userStore.currentUser().id)
    }

    return this.http.get<IPaginatedList<IAutomation>>(`${this.apiUrl}/automations`, {params}).pipe(
      tap(automationsList => this.automationsStore.automations.set(automationsList))
    );
  }

  getAutomationAdmin(id: string): Observable<IAutomation> {
    return this.http.get<IAutomation>(`${this.apiUrl}/automations/admin/${id}`)
      .pipe(tap(x => this.automationsStore.automation.set(x)));
  }

  getAutomationUser(id: string): Observable<IAutomation> {
    return this.http.get<IAutomation>(`${this.apiUrl}/automations/${id}`)
      .pipe(tap(x => this.automationsStore.automation.set(x)));
  }

  createAutomation(automation: IAutomation): Observable<any> {
    return this.http.post<IAutomation>(`${this.apiUrl}/automations`, automation);
  }

  updateAutomation(automation: IAutomation): Observable<any> {
    return this.http.put<IAutomation>(`${this.apiUrl}/automations`, automation);
  }

  deleteAutomation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/automations/${id}`);
  }

  appendUsers(appendModel: IAppendUserModel): Observable<any> {
    return this.http.patch(`${this.apiUrl}/automations/users/append`, appendModel);
  }

  detachUsers(appendModel: IAppendUserModel): Observable<any> {
    return this.http.patch(`${this.apiUrl}/automations/users/detach`, appendModel);
  }

  getLogs(page: number, count: number): Observable<IPaginatedList<ILogItem>> {
    const params = new HttpParams()
      .set('automationId', this.automationsStore.automation()?.id!)
      // .set('userId', this.userStore.currentUser().id)
      .set('page', page)
      .set('count', count);
    return this.http.get<IPaginatedList<ILogItem>>(`${this.apiUrl}/automations/logs`, {params});
  }

  getAutomationAccess(automationId: string): Observable<{ value: boolean }> {
    return this.http.get<{ value: boolean }>(`${this.apiUrl}/automations/${automationId}/access`)
  }

  getAutomationIntents(automationId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/automations/${automationId}/intents`).pipe(
      tap(x => this.automationsStore.intents.set(x))
    )
  }
}
