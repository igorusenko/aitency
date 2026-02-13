import {
  AccountType,
  BusinessModel,
  CompanySize, CrmType,
  IndustryType,
  MainGoal,
  OnboardingStatus
} from '../../enums/common.enums';

export interface IOnboardingStatus {
  status: OnboardingStatus;
  step: string;
}

export interface InvoiceAddressInfo {
  fullName: string | null;
  street: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
}

// =========================
// Company Info
// =========================
export interface CompanyInfo {
  name: string | null;
  website: string | null;
  vatTaxId: string | null;
}

// =========================
// Onboarding Step First
// =========================
export interface OnboardingStepFirstRequest {
  accountType: AccountType;
  needInvoice: boolean;
  invoiceAddress: InvoiceAddressInfo | null;
  companyInfo: CompanyInfo | null;
}

export interface OnboardingStepSecondRequest {
  industry: IndustryType;
  industryOther: string | null;

  companySize: CompanySize;
  businessModel: BusinessModel;

  mainGoal: MainGoal;
  mainGoalOther: string | null;

  monthlyInquiriesVolume: string | null;

  crmType: CrmType;

  timezone: string | null;
}
