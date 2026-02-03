import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment.development';
import {Observable, tap} from 'rxjs';
import {UserStore} from './user.store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userStore = inject(UserStore);
  private readonly apiUrl = environment.apiUrl;

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/me`)
      .pipe(tap(user => {
        this.userStore.currentUser.set(user);
      }));
  }
}
