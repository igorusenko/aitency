import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';
import {CsrfStore} from './csrf.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly csrfStore = inject(CsrfStore);
  private readonly apiUrl = environment.apiUrl;

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/sign-in`, {
      email, password
    })
  }

  logout(): void {
    this.http.post<any>(`${this.apiUrl}/auth/sign-out`, {}).subscribe(() => {
      this.csrfStore.csrfToken.set('');
      this.router.navigate(['/login']);
    });
  }
}
