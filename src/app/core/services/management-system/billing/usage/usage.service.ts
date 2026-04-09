import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserStore} from '../../../../stores/user.store';
import {environment} from '../../../../../../environments/environment';
import {finalize, Observable, tap} from 'rxjs';
import {IUsage, IUsageSummary, IUsageTrend} from '../../../../interfaces/billing/usage/usage.interface';
import {IPaginatedList} from '../../../../interfaces/paginated-list-interface';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  private readonly http = inject(HttpClient);
  private readonly userStore = inject(UserStore);
  private readonly apiUrl = `${environment.apiUrl}/billing`;

  usageOverview = signal<IUsage | undefined>(undefined);
  usageSummary = signal<IUsageSummary | undefined>(undefined);
  usageTrends = signal<Array<IUsageTrend> | undefined>(undefined);
  usageDetails = signal<IPaginatedList<IUsageTrend> | undefined>(undefined);

  loadingOverview = signal(false);
  loadingSummary = signal(false);
  loadingTrends = signal(false);
  loadingDetails = signal(false);

  getUsageOverview(): Observable<IUsage> {
    this.loadingOverview.set(true);

    return this.http.get<IUsage>(`${this.apiUrl}/usage/overview`).pipe(
      tap(usage => this.usageOverview.set(usage)),
      finalize(() => this.loadingOverview.set(false))
    );
  }

  getUsageSummary(): Observable<IUsageSummary> {
    this.loadingSummary.set(true);

    return this.http.get<IUsageSummary>(`${this.apiUrl}/usage/summary`).pipe(
      tap(data => this.usageSummary.set(data)),
      finalize(() => this.loadingSummary.set(false))
    );
  }

  getUsageTrends(days: number): Observable<Array<IUsageTrend>> {
    this.loadingTrends.set(true);

    return this.http.get<Array<IUsageTrend>>(`${this.apiUrl}/usage/trend`, { params: { days } }).pipe(
      tap(data => this.usageTrends.set(data)),
      finalize(() => this.loadingTrends.set(false))
    );
  }

  getUsageDetails(page: number, count: number, sortBy: string, sortDirection: string): Observable<IPaginatedList<IUsageTrend>> {
    this.loadingDetails.set(true);

    return this.http.get<IPaginatedList<IUsageTrend>>(`${this.apiUrl}/usage/details`, {
      params: { page, count, sortBy, sortDirection }
    }).pipe(
      tap(data => this.usageDetails.set(data)),
      finalize(() => this.loadingDetails.set(false))
    );
  }
}
