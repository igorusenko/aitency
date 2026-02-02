import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {}

  async loadCsrfToken(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ token: string; }>(`${environment.apiUrl}/auth/csrf-token`)
      );
      this.csrfToken = res.token;
    } catch (err) {
      console.error('Failed to load CSRF token', err);
    }
  }

  get token() {
    return this.csrfToken;
  }
}
