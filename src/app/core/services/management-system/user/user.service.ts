import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable, tap} from 'rxjs';
import {UserStore} from './user.store';
import {IUser} from '../../../interfaces/users/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userStore = inject(UserStore);
  private readonly apiUrl = environment.apiUrl;

  getUsers(page: number, count: number): Observable<any> {
    const params = new HttpParams()
      // .set('userId', this.userStore.currentUser().id)
      .set('page', page)
      .set('count', count);

    return this.http.get<any>(`${this.apiUrl}/users`, {params})
      .pipe(tap(users => this.userStore.users.set(users)));
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/me`)
      .pipe(tap(user => {
        this.userStore.currentUser.set(user);
      }));
  }

  getUserById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`)
      .pipe(tap(user => this.userStore.userById.set(user)));
  }

  createUser(user: IUser): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }

  updateUser(user: IUser): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  getUserPassword(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${this.userStore.userById().id}/password`)
  }
}
