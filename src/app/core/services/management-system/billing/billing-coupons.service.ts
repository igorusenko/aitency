import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {
  ApplyBillingDiscountCouponRequest,
  ApplyBillingDiscountCouponResponse,
  BillingAdminCouponParams,
  BillingCouponListItemResponse,
  BillingCouponResponse,
  BillingCouponRedemptionListItemResponse,
  DuplicateBillingCouponRequest,
  ReactivateBillingCouponRequest,
  RedeemBillingCouponRequest,
  RedeemBillingCouponResponse,
  UpdateBillingCouponRequest,
  CreateBillingCouponRequest,
} from '../../../interfaces/billing/billing-coupons.interface';
import {IPaginatedList} from '../../../interfaces/paginated-list-interface';

@Injectable({providedIn: 'root'})
export class BillingCouponsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/billing`;

  // User endpoints
  redeem(request: RedeemBillingCouponRequest): Observable<RedeemBillingCouponResponse> {
    return this.http.post<RedeemBillingCouponResponse>(`${this.apiUrl}/coupons/redeem`, request);
    }

  applyDiscount(request: ApplyBillingDiscountCouponRequest): Observable<ApplyBillingDiscountCouponResponse> {
    return this.http.post<ApplyBillingDiscountCouponResponse>(`${this.apiUrl}/coupons/apply-discount`, request);
  }

  getRedemptions(params?: { page?: number; count?: number; }): Observable<IPaginatedList<BillingCouponRedemptionListItemResponse>> {
    return this.http.get<IPaginatedList<BillingCouponRedemptionListItemResponse>>(`${this.apiUrl}/coupons/redemptions`, { params: params as any });
  }

  // Admin endpoints
  createAdminCoupon(request: CreateBillingCouponRequest): Observable<BillingCouponResponse> {
    return this.http.post<BillingCouponResponse>(`${this.apiUrl}/admin/coupons`, request);
  }

  updateAdminCoupon(couponId: string, request: UpdateBillingCouponRequest): Observable<BillingCouponResponse> {
    return this.http.patch<BillingCouponResponse>(`${this.apiUrl}/admin/coupons/${couponId}`, request);
  }

  disableAdminCoupon(couponId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/coupons/${couponId}/disable`, {});
  }

  reactivateAdminCoupon(couponId: string, request: ReactivateBillingCouponRequest): Observable<BillingCouponResponse> {
    return this.http.post<BillingCouponResponse>(`${this.apiUrl}/admin/coupons/${couponId}/reactivate`, request ?? {});
  }

  duplicateAdminCoupon(couponId: string, request: DuplicateBillingCouponRequest): Observable<BillingCouponResponse> {
    return this.http.post<BillingCouponResponse>(`${this.apiUrl}/admin/coupons/${couponId}/duplicate`, request);
  }

  deleteAdminCoupon(couponId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/coupons/${couponId}`);
  }

  getAdminCouponById(couponId: string): Observable<BillingCouponResponse> {
    return this.http.get<BillingCouponResponse>(`${this.apiUrl}/admin/coupons/${couponId}`);
  }

  getAdminCoupons(params?: BillingAdminCouponParams): Observable<IPaginatedList<BillingCouponListItemResponse>> {
    return this.http.get<IPaginatedList<BillingCouponListItemResponse>>(`${this.apiUrl}/admin/coupons`, { params: params as any });
  }
}
