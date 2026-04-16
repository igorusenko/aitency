export interface IBillingSettings {
  "billingDetails": IBillingDetails,
  "autoRechargeSettings": IAutoRechargeSettings,
  "notificationPreferences": INotificationPreferences
}

export interface IBillingDetails {
  "billingEmail": string;
  "companyName": string;
  "vatNumber": string;
  "streetAddress": string;
  "city": string;
  "state": string;
  "zip": string;
}

export interface IAutoRechargeSettings {
  "autoRechargeEnabled": boolean;
  "autoRechargeThreshold": number;
  "autoRechargeAmount": number;
}

export interface INotificationPreferences {
  "invoiceIssuedEnabled": boolean;
  "paymentReceivedEnabled": boolean;
  "subscriptionRenewalReminderEnabled": boolean;
  "lowBalanceAlertEnabled": boolean;
  "overdueInvoiceReminderEnabled": boolean;
  "newFeatureAnnouncementEnabled": boolean;
}
