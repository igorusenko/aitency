import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {IPaginatedList} from '../../../interfaces/paginated-list-interface';
import {IAutomation} from '../../../interfaces/automations/automation-interface';
import {UserService} from '../user/user.service';
import {AutomationsStore} from '../../../stores/automations.store';
import {IAppendUserModel} from '../../../interfaces/users/user';

@Injectable({
  providedIn: 'root',
})
export class AutomationAdminService {
  private readonly http = inject(HttpClient);
  private readonly automationsStore = inject(AutomationsStore);
  private readonly apiUrl = environment.apiUrl;

  getAutomations(): Observable<IPaginatedList<IAutomation>> {
    return this.http.get<IPaginatedList<IAutomation>>(`${this.apiUrl}/automation`).pipe(
      tap(automationsList => this.automationsStore.automations.set(automationsList))
    );
  }

  getAutomationAdmin(id: string): Observable<IAutomation> {
    return this.http.get<IAutomation>(`${this.apiUrl}/automation/admin/${id}`)
      .pipe(tap(x => this.automationsStore.automation.set(x)));
  }

  createAutomation(automation: IAutomation): Observable<any> {
    return this.http.post<IAutomation>(`${this.apiUrl}/automation`, automation);
  }

  updateAutomation(automation: IAutomation): Observable<any> {
    return this.http.put<IAutomation>(`${this.apiUrl}/automation`, automation);
  }

  deleteAutomation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/automation/${id}`);
  }

  appendUsers(appendModel: IAppendUserModel): Observable<any> {
    return this.http.patch(`${this.apiUrl}/automation/users/append`, appendModel);
  }

  detachUsers(appendModel: IAppendUserModel): Observable<any> {
    return this.http.patch(`${this.apiUrl}/automation/users/detach`, appendModel);
  }
}
