export enum BillingPaymentGateway {
  Stripe = 'Stripe',
  Mollie = 'Mollie',
  Manual = 'Manual'
}

export enum BillingPaymentMethodType {
  Card = 'Card',
  Sepa = 'Sepa',
  Wire = 'Wire',
  Other = 'Other'
}

export enum BillingPaymentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  PartiallyRefunded = 'PartiallyRefunded',
  Refunded = 'Refunded'
}

export type CurrencyCode = string; // Или можно расширить до конкретных кодов, если нужно

export interface BillingBalanceResponse {
  clientId: string;
  balance: number;
  currency: CurrencyCode;
  updatedAt: string;
}

export interface BillingPaymentMethodResponse {
  id: string;
  gateway: BillingPaymentGateway;
  gatewayPaymentMethodId: string | null;
  type: BillingPaymentMethodType;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
  label: string | null;
  maskedValue: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddBillingPaymentMethodRequest {
  gateway: BillingPaymentGateway;
  gatewayPaymentMethodId?: string | null;
  label?: string | null;
  setAsDefault: boolean;
}

export interface CreateTopUpRequest {
  amount: number;
  paymentMethodId: string;
  idempotencyKey?: string | null;
  returnUrl?: string | null;
}

export interface CreateTopUpResponse {
  paymentId: string;
  gatewayTransactionId: string | null;
  clientSecret: string | null;
  status: BillingPaymentStatus;
  isIdempotentReplay: boolean;
}

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
}
