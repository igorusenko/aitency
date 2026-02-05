import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../admin/user/user.service';
import {Observable} from 'rxjs';
import {IAutomation} from '../../interfaces/automations/automation-interface';
import {environment} from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AutomationUserService {
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly apiUrl = environment.apiUrl;

  getAutomationUser(id: string): Observable<IAutomation> {
    return this.http.get<IAutomation>(`${this.apiUrl}/automation/${id}`)
  }
}
