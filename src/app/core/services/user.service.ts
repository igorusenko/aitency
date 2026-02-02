import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`);
  }
}
