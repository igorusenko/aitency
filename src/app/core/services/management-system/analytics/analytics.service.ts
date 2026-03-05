import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable, tap} from 'rxjs';
import {IAnalytics} from '../../../interfaces/analytics/analytics.interface';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  analytics: WritableSignal<IAnalytics | undefined> = signal(undefined);

  getAnalyticsByUserId(userId: string, from?: string, to?: string): Observable<IAnalytics> {
    let params = new HttpParams().set('userId', userId);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<IAnalytics>(`${this.apiUrl}/analytics/automation-logs`, {params})
      .pipe(tap(analytics => this.analytics.set(analytics)))
  }

  getMyAnalytics(from?: string, to?: string): Observable<IAnalytics> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<IAnalytics>(`${this.apiUrl}/analytics/automation-logs/me`, {params})
      .pipe(tap(analytics => this.analytics.set(analytics)))
  }
}
