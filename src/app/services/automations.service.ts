import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AutomationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAutomations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/automation`);
  }
}
