import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`)
      .pipe(tap(users => this.userStore.users.set(users)));
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/me`)
      .pipe(tap(user => {
        this.userStore.currentUser.set(user);
      }));
  }

  getUserById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/user/${id}`)
      .pipe(tap(user => this.userStore.userById.set(user)));
  }

  createUser(user: IUser): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user`, user);
  }

  updateUser(user: IUser): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user/${id}`);
  }

  getUserPassword(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${this.userStore.userById().id}/password`)
  }
}
