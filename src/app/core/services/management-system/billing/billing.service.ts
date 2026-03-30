import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  BillingBalanceResponse,
  BillingPaymentMethodResponse,
  AddBillingPaymentMethodRequest,
  CreateTopUpRequest,
  CreateTopUpResponse,
  BillingPaymentParams,
  BillingPaymentListItemResponse,
  BillingInvoiceParams,
  BillingInvoiceListItemResponse,
  BillingInvoiceResponse,
  PayBillingInvoiceRequest,
  BillingAdminInvoiceParams,
  CreateManualBillingInvoiceRequest,
  UpdateManualBillingInvoiceRequest,
  BillingAdminPaymentParams,
  BillingPlanResponse,
  CreateBillingPlanRequest,
  UpdateBillingPlanRequest
} from '../../../interfaces/billing/billing.interface';
import { IPaginatedList } from '../../../interfaces/paginated-list-interface';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/billing`;

  balance = signal<BillingBalanceResponse | undefined>(undefined);
  balanceLoading = signal<boolean>(false);

  getBalance(): Observable<BillingBalanceResponse> {
    return this.http.get<BillingBalanceResponse>(`${this.apiUrl}/balance`).pipe(
      tap(balance => {
        this.balanceLoading.set(false);
        this.balance.set(balance)
      })
    );
  }

  refreshBalance(): void {
    this.balanceLoading.set(true);
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

  getPayments(params?: BillingPaymentParams): Observable<IPaginatedList<BillingPaymentListItemResponse>> {
    return this.http.get<IPaginatedList<BillingPaymentListItemResponse>>(`${this.apiUrl}/payments`, { params: params as any });
  }

  getInvoices(params?: BillingInvoiceParams): Observable<IPaginatedList<BillingInvoiceListItemResponse>> {
    return this.http.get<IPaginatedList<BillingInvoiceListItemResponse>>(`${this.apiUrl}/invoices`, { params: params as any });
  }

  getInvoiceById(invoiceId: string): Observable<BillingInvoiceResponse> {
    return this.http.get<BillingInvoiceResponse>(`${this.apiUrl}/invoices/${invoiceId}`);
  }

  payInvoice(invoiceId: string, request: PayBillingInvoiceRequest): Observable<CreateTopUpResponse> {
    return this.http.post<CreateTopUpResponse>(`${this.apiUrl}/invoices/${invoiceId}/pay-intent`, request);
  }

  // Admin methods
  getAdminInvoices(params?: BillingAdminInvoiceParams): Observable<IPaginatedList<BillingInvoiceListItemResponse>> {
    return this.http.get<IPaginatedList<BillingInvoiceListItemResponse>>(`${this.apiUrl}/admin/invoices`, { params: params as any });
  }

  getAdminInvoiceById(invoiceId: string): Observable<BillingInvoiceResponse> {
    return this.http.get<BillingInvoiceResponse>(`${this.apiUrl}/admin/invoices/${invoiceId}`);
  }

  createAdminInvoice(request: CreateManualBillingInvoiceRequest): Observable<BillingInvoiceResponse> {
    return this.http.post<BillingInvoiceResponse>(`${this.apiUrl}/admin/invoices`, request);
  }

  updateAdminInvoice(invoiceId: string, request: UpdateManualBillingInvoiceRequest): Observable<BillingInvoiceResponse> {
    return this.http.put<BillingInvoiceResponse>(`${this.apiUrl}/admin/invoices/${invoiceId}`, request);
  }

  issueAdminInvoice(invoiceId: string): Observable<BillingInvoiceResponse> {
    return this.http.post<BillingInvoiceResponse>(`${this.apiUrl}/admin/invoices/${invoiceId}/issue`, {});
  }

  cancelAdminInvoice(invoiceId: string): Observable<BillingInvoiceResponse> {
    return this.http.post<BillingInvoiceResponse>(`${this.apiUrl}/admin/invoices/${invoiceId}/cancel`, {});
  }

  getAdminPayments(params?: BillingAdminPaymentParams): Observable<IPaginatedList<BillingPaymentListItemResponse>> {
    return this.http.get<IPaginatedList<BillingPaymentListItemResponse>>(`${this.apiUrl}/admin/payments`, { params: params as any });
  }

  getPlan(planId: string): Observable<BillingPlanResponse> {
    return this.http.get<BillingPlanResponse>(`${this.apiUrl}/plans/${planId}`);
  }

  getAdminPlans(): Observable<BillingPlanResponse[]> {
    return this.http.get<BillingPlanResponse[]>(`${this.apiUrl}/admin/plans`);
  }

  createAdminPlan(request: CreateBillingPlanRequest): Observable<BillingPlanResponse> {
    return this.http.post<BillingPlanResponse>(`${this.apiUrl}/admin/plans`, request);
  }

  getAdminPlan(planId: string): Observable<BillingPlanResponse> {
    return this.http.get<BillingPlanResponse>(`${this.apiUrl}/admin/plans/${planId}`);
  }

  updateAdminPlan(planId: string, request: UpdateBillingPlanRequest): Observable<BillingPlanResponse> {
    return this.http.patch<BillingPlanResponse>(`${this.apiUrl}/admin/plans/${planId}`, request);
  }

  deleteAdminPlan(planId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/plans/${planId}`);
  }
}
