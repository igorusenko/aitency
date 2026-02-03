import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {}

  loadCsrfToken(): Promise<void> {
    // Делаем GET-запрос на сервер для получения CSRF токена
    return firstValueFrom(this.http.get<{ csrfToken: string }>('/api/csrf'))
      .then(res => {
        this.csrfToken = res.csrfToken;
        console.log('CSRF token loaded:', this.csrfToken);
      })
      .catch(err => {
        console.error('Failed to load CSRF token', err);
      });
  }

  get token() {
    return this.csrfToken;
  }
}
