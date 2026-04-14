import {CurrencyCode} from './billing.interface';

export enum BillingCouponType {
  PercentageDiscount = 'PercentageDiscount',
  FixedDiscount = 'FixedDiscount',
  VirtualDeposit = 'VirtualDeposit'
}

// Requests
export interface RedeemBillingCouponRequest {
  couponCode: string; // maxLength = 64
}

export interface ApplyBillingDiscountCouponRequest {
  invoiceId: string; // guid
  couponCode: string; // maxLength = 64
}

export interface CreateBillingCouponRequest {
  code: string; // maxLength = 64, trim + upper on server
  type: BillingCouponType;
  value: number; // > 0, for PercentageDiscount <= 100
  expiryDate?: string | null; // ISO date-time
  usageLimit?: number | null; // > 0 if provided
  maxPerClient?: number | null; // > 0 if provided and <= usageLimit
}

export interface UpdateBillingCouponRequest {
  value: number; // > 0
  expiryDate?: string | null;
  usageLimit?: number | null; // > 0 if provided
  maxPerClient?: number | null; // > 0 if provided and <= usageLimit
}

export interface ReactivateBillingCouponRequest {
  expiryDate?: string | null; // must be today or future; if not set server uses today+30d
}

export interface DuplicateBillingCouponRequest {
  newCode: string; // maxLength = 64
  expiryDate?: string | null; // must be today or future; if not set server uses today+30d
}

// Responses
export interface BillingCouponResponse {
  id: string;
  code: string;
  type: BillingCouponType;
  value: number;
  expiryDate: string | null;
  usageLimit: number | null;
  currentUsage: number;
  maxPerClient: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BillingCouponListItemResponse = BillingCouponResponse;

export interface BillingCouponRedemptionListItemResponse {
  redemptionId: string;
  couponId: string;
  couponCode: string;
  couponType: BillingCouponType;
  invoiceId?: string | null;
  appliedAmount: number;
  createdAt: string;
}

export interface RedeemBillingCouponResponse {
  couponId: string;
  couponCode: string;
  couponType: BillingCouponType;
  appliedAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: CurrencyCode;
  ledgerEntryId: string;
  redeemedAt: string;
}

export interface ApplyBillingDiscountCouponResponse {
  invoiceId: string;
  couponId: string;
  couponCode: string;
  couponType: BillingCouponType;
  appliedAmount: number;
  invoiceSubtotal: number;
  invoiceDiscountAmount: number;
  invoiceTotal: number;
  currency: CurrencyCode;
  appliedAt: string;
}

export interface BillingAdminCouponParams {
  search?: string | null;
  isActive?: boolean | null;
  page?: number;
  count?: number;
}
