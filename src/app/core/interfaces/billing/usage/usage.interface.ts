export interface IUsage {
  "activeSubscriptionsCount": number,
  "activeSubscriptionNames": Array<string>,
  "outstandingInvoicesCount": number,
  "mostOverdueInvoiceNumber": string,
  "mostOverdueDays": number,
  "thisMonthUsage": number,
  "lastPayment": IUsageLasPayment,
  "nextRenewal": IUsageNextRenewal
}

export interface IUsageSummary {
  "currentPeriodStart": string | Date,
  "currentPeriodEnd": string,
  "daysRemaining": number,
  "totalUsage": number,
  "currentPeriodCost": number,
  "subscriptionCost": number,
  "unitPricePreview": number,
  "currency": string
}

export interface IUsageTrend {
  "date": string,
  "quantity": number,
  "cost": number
}

export interface IUsageDetails {
  "date": string,
  "metric": string,
  "quantity": number,
  "unitPrice": number,
  "total": number,
  "currency": string
}

export interface IUsageLasPayment {
  "dateLabel": string,
  "amount": number,
  "currency": string,
  "method": string
}

export interface IUsageNextRenewal {
  "dateLabel": string,
  "planName": string
}

export enum UsageRateTypes {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}
