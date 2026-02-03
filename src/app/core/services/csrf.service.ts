import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom, Observable, take, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CsrfStore} from './csrf.store';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  csrfStore = inject(CsrfStore)
  constructor(private http: HttpClient) {}

  loadCsrfToken(): Observable<any> {
   return this.http.get<{ token: string }>(`${environment.apiUrl}/auth/csrf-token`).pipe(
     tap(data => {
       this.csrfStore.csrfToken.set(data.token);
     }),
      take(1)
    )
  }
}
