import {FormControl, FormGroup} from '@angular/forms';
import {OnboardingStepFirstRequest, OnboardingStepSecondRequest} from '../../interfaces/onboarding/onboarding.iterface';

export type OnboardingStepFirstForm = FormGroup<{
  accountType: FormControl<OnboardingStepFirstRequest['accountType']>;
  needInvoice: FormControl<OnboardingStepFirstRequest['needInvoice']>;
  invoiceAddress: FormGroup<{
    fullName: FormControl<string | null>;
    street: FormControl<string | null>;
    city: FormControl<string | null>;
    postalCode: FormControl<string | null>;
    country: FormControl<string | null>;
  }>;
  companyInfo?: FormGroup<{
    name: FormControl<string | null>;
    website: FormControl<string | null>;
    vatTaxId: FormControl<string | null>;
  }>;
}>;

export type OnboardingStepSecondForm = FormGroup<{
  industry: FormControl<OnboardingStepSecondRequest['industry'] | null>;
  industryOther: FormControl<string | null>;

  companySize: FormControl<OnboardingStepSecondRequest['companySize'] | null>;
  businessModel: FormControl<OnboardingStepSecondRequest['businessModel'] | null>;

  mainGoal: FormControl<OnboardingStepSecondRequest['mainGoal'] | null>;
  mainGoalOther: FormControl<string | null>;

  monthlyInquiriesVolume: FormControl<string | null>;

  crmType: FormControl<OnboardingStepSecondRequest['crmType'] | null>;
  timezone: FormControl<string | null>;
}>;
