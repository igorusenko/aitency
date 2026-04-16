import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {
  IAutoRechargeSettings,
  IBillingSettings,
  INotificationPreferences
} from '../../../interfaces/billing/billing-settings.interface';

@Injectable({
  providedIn: 'root',
})
export class BillingSettingsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/billing`;

  getBillingSettings(): Observable<IBillingSettings> {
    return this.http.get<IBillingSettings>(`${this.apiUrl}/settings`);
  }

  updateAutoRecharge(request: IAutoRechargeSettings): Observable<IBillingSettings> {
    return this.http.put<IBillingSettings>(`${this.apiUrl}/settings/auto-recharge`, request);
  }

  updateNotificationPreferences(request: INotificationPreferences): Observable<IBillingSettings> {
    return this.http.put<IBillingSettings>(`${this.apiUrl}/settings/notification-preferences`, request);
  }
}
