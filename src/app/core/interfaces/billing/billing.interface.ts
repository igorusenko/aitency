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
  Refunded = 'Refunded',
  Canceled = 'Canceled'
}

export enum BillingInvoiceStatus {
  Draft = 'Draft',
  Issued = 'Issued',
  Paid = 'Paid',
  Overdue = 'Overdue',
  Canceled = 'Canceled',
  Refunded = 'Refunded'
}

export enum BillingInvoiceType {
  Invoice = 'Invoice',
  Quote = 'Quote',
  CreditNote = 'CreditNote'
}

export enum BillingInvoiceLineType {
  Subscription = 'Subscription',
  Usage = 'Usage',
  Proration = 'Proration',
  Adjustment = 'Adjustment',
  Manual = 'Manual'
}

export enum BillingPlanInterval {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

export type CurrencyCode = string; // Или можно расширить до конкретных кодов, если нужно

export interface BillingBalanceResponse {
  clientId: string;
  balance: number;
  currency: CurrencyCode;
  updatedAt: string;
}

export interface BillingPaymentListItemResponse {
  id: string;
  clientId: string;
  gateway: BillingPaymentGateway;
  gatewayTransactionId: string | null;
  amount: number;
  currency: CurrencyCode;
  status: BillingPaymentStatus;
  paymentMethodId: string | null;
  reference: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BillingInvoiceItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
  total: number;
}

export interface BillingInvoiceListItemResponse {
  id: string;
  clientId: string;
  invoiceNumber: string;
  total: number;
  currency: CurrencyCode;
  status: BillingInvoiceStatus;
  dateIssued: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingInvoiceResponse extends BillingInvoiceListItemResponse {
  items: BillingInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes: string | null;
  type: BillingInvoiceType;
  lines: BillingInvoiceLine[]
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

export interface PayBillingInvoiceRequest {
  paymentMethodId: string;
  idempotencyKey?: string | null;
  returnUrl?: string | null;
}

export interface BillingInvoiceLine {
  amount: number;
  description: string;
  id: string;
  lineType: BillingInvoiceLineType;
  quantity: number;
  sortOrder: number;
  unitPrice: number;
}

export interface CreateManualBillingInvoiceRequest {
  clientId: string;
  dueDate: string;
  discountAmount: number;
  taxAmount: number;
  notes?: string | null;
  lines: BillingInvoiceLine[];
  invoiceNumber: string;
}

export interface UpdateManualBillingInvoiceRequest {
  items: Omit<BillingInvoiceItem, 'id' | 'total'>[];
  dateDue: string;
  notes?: string | null;
}

export interface BillingPaymentParams {
  type?: BillingPaymentGateway;
  createdAtFrom?: string;
  createdAtTo?: string;
  reference?: string;
  page?: number;
  count?: number;
}

export interface BillingInvoiceParams {
  status?: BillingInvoiceStatus;
  dateIssuedFrom?: string;
  dateIssuedTo?: string;
  invoiceNumber?: string;
  page?: number;
  count?: number;
}

export interface BillingAdminInvoiceParams extends BillingInvoiceParams {
  clientId?: string;
}

export interface BillingAdminPaymentParams extends BillingPaymentParams {
  clientId?: string;
}

export interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
}

export interface BillingPlanResponse {
  id: string;
  name: string;
  slug: string;
  price: number;
  billingCycle: BillingPlanInterval;
  description: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean,
}

export interface CreateBillingPlanRequest {
  name: string;
  slug: string;
  price: number;
  billingCycle: BillingPlanInterval;
  description: string;
  currency: string;
}

export interface UpdateBillingPlanRequest {
  name?: string;
  slug?: string;
  price?: number;
  billingCycle?: BillingPlanInterval;
  description?: string;
  currency?: string;
}

export interface BillingSubscriptionResponse {
  id: string;
  planId: string;
  planName: string;
  status: BillingSubscriptionStatus;
  startDate: string;
  endDate: string | null;
  renewalDate: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillingSubscriptionRequest {
  planId: string;
}

export interface UpgradeBillingSubscriptionRequest {
  planId: string;
}

export interface CancelBillingSubscriptionRequest {
  reason?: string;
}

export enum BillingSubscriptionStatus {
  Active = 'Active',
  Pending = 'Pending',
  Canceled = 'Canceled',
  Expired = 'Expired',
  Paused = 'Paused'
}

export interface IClient {
  billingEmail: string,
  companyName: string,
  vatNumber: string,
  streetAddress: string,
  city: string,
  state: string,
  zip: string
}

export interface RecentTransaction {
  id: string,
  date: string,
  description: string,
  type: string,
  amount: number,
  balanceAfter: number,
  currency: string
}
