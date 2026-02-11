import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {IRegistration, ISetPassword} from '../../../interfaces/registration.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/sign-in`, {
      email, password
    })
  }

  register(registrationModel: IRegistration): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, registrationModel)
  }

  verifyPassword(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/set-password/verify?token=${token}`)
  }

  setPassword(setPasswordModel: ISetPassword): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/set-password`, setPasswordModel)
  }

  logout(): void {
    this.http.post<any>(`${this.apiUrl}/auth/sign-out`, {}).subscribe(x => {
      this.router.navigate(['/login']);
    })
  }

  isAuthenticated(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/validate`)
  }

  validateAccessToken(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/validate`)
  }
}
