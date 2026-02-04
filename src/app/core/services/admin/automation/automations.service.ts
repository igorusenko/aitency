import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment.development';
import {IPaginatedList} from '../../../interfaces/paginated-list-interface';
import {IAutomation} from '../../../interfaces/automations/automation-interface';
import {UserService} from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AutomationsService {
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly apiUrl = environment.apiUrl;

  getAutomations(): Observable<IPaginatedList<IAutomation>> {
    return this.http.get<IPaginatedList<IAutomation>>(`${this.apiUrl}/automation`);
  }

  getAutomation(id: string): Observable<IAutomation> {
    const params = new HttpParams()
      .set('userId', id)
    return this.http.get<IAutomation>(`${this.apiUrl}/automation/${id}`, {params});
  }
}
