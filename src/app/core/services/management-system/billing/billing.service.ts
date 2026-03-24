import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  BillingBalanceResponse,
  BillingPaymentMethodResponse,
  AddBillingPaymentMethodRequest,
  CreateTopUpRequest,
  CreateTopUpResponse
} from '../../../interfaces/billing/billing.interface';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/billing`;
  secretKey = 'pk_test_51TCIzBPzFQky4L5mFphkxPYPS1GUYvBQHv1pLOHl745YESpWYe3n4G4g5sw4WCIZYYYbj4ppI7LsBcVfZfqgO6ti00nc8NHIxg';

  balance = signal<BillingBalanceResponse | undefined>(undefined);

  getBalance(): Observable<BillingBalanceResponse> {
    return this.http.get<BillingBalanceResponse>(`${this.apiUrl}/balance`).pipe(
      tap(balance => this.balance.set(balance))
    );
  }

  refreshBalance(): void {
    this.getBalance().subscribe();
  }

  getPaymentMethods(): Observable<BillingPaymentMethodResponse[]> {
    return this.http.get<BillingPaymentMethodResponse[]>(`${this.apiUrl}/payment-methods`);
  }

  addPaymentMethod(request: AddBillingPaymentMethodRequest): Observable<BillingPaymentMethodResponse> {
    return this.http.post<BillingPaymentMethodResponse>(`${this.apiUrl}/payment-methods`, request);
  }

  deletePaymentMethod(paymentMethodId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/payment-methods/${paymentMethodId}`);
  }

  setDefaultPaymentMethod(paymentMethodId: string): Observable<BillingPaymentMethodResponse> {
    return this.http.post<BillingPaymentMethodResponse>(`${this.apiUrl}/payment-methods/${paymentMethodId}/default`, {});
  }

  topUp(request: CreateTopUpRequest): Observable<CreateTopUpResponse> {
    return this.http.post<CreateTopUpResponse>(`${this.apiUrl}/top-up`, request);
  }
}
