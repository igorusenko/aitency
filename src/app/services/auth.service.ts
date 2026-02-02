import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  cookieService = inject(CookieService)
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/sign-in`, {
      email, password
    })
  }

  getToken(): string | null {
    return this.cookieService.get('accessToken');
  }

  clearToken() {
    cookieStore.set('access_token', 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/');
  }

}
