import {Component, inject, OnInit} from '@angular/core';
import {StepperModule} from 'primeng/stepper';
import {Button} from 'primeng/button';
import {TabsModule} from 'primeng/tabs';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Checkbox} from 'primeng/checkbox';
import {Message} from 'primeng/message';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {Router, RouterLink} from '@angular/router';
import {OnboardingStepFirstForm, OnboardingStepSecondForm} from '../../../core/forms/onboarding/onboarding.forms';
import {OnboardingService} from '../../../core/services/management-system/onboarding/onboarding.service';
import {ONBOARDING_STEP, INDUSTRY_TYPE, COMPANY_SIZE, BUSINESS_MODEL, MAIN_GOAL, CRM_TYPE} from '../../../core/enums/common.enums';
import {Select} from 'primeng/select';
import {MessageService} from 'primeng/api';
import {OnboardingStepFirstRequest} from '../../../core/interfaces/onboarding/onboarding.iterface';
import {concatMap} from 'rxjs';

@Component({
  selector: 'app-onboarding',
  imports: [StepperModule, Button, TabsModule, ReactiveFormsModule, Checkbox, Message, FloatLabel, InputText, Select],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding implements OnInit {
  fb = inject(FormBuilder);
  onboardingService = inject(OnboardingService);
  router = inject(Router);
  messageService = inject(MessageService);
  privateForm: FormGroup;
  companyForm: FormGroup;
  businessForm: FormGroup;
  privateFormSubmitted: boolean = false;
  companyFormSubmitted: boolean = false;
  businessFormSubmitted: boolean = false;
  tabs = [
    { title: 'Private person', value: 0, content: 'Tab 1 Content' },
    { title: 'Company', value: 1, content: 'Tab 2 Content' },
  ];
  tabValue = 0;
  stepValue = 1;
  firstStepCompleted = false;

  INDUSTRY_TYPE = INDUSTRY_TYPE;
  COMPANY_SIZE = COMPANY_SIZE;
  BUSINESS_MODEL = BUSINESS_MODEL;
  MAIN_GOAL = MAIN_GOAL;
  CRM_TYPE = CRM_TYPE;

  industryOptions = Object.values(INDUSTRY_TYPE);
  companySizeOptions = Object.values(COMPANY_SIZE);
  businessModelOptions = Object.values(BUSINESS_MODEL);
  mainGoalOptions = Object.values(MAIN_GOAL);
  crmTypeOptions = Object.values(CRM_TYPE);

  ngOnInit() {
    this.getOnboardingStatus();
    this.initPrivateForm();
    this.initCompanyForm();
    this.initBusinessForm();
  }

  getOnboardingStatus(): void {
    if (this.onboardingService.onboardingStatus()?.step === ONBOARDING_STEP.First) {
      this.firstStepCompleted = true;
      this.stepValue = 2;
    }
  }

  initPrivateForm(): void {
    this.privateForm = new FormGroup({
      accountType: new FormControl('Private', { nonNullable: true }),
      needInvoice: new FormControl(false, { nonNullable: true }),

      invoiceAddress: new FormGroup({
        fullName: new FormControl(null),
        street: new FormControl(null),
        city: new FormControl(null),
        postalCode: new FormControl(null),
        country: new FormControl(null),
      }),
    }) as OnboardingStepFirstForm;
    this.onPrivateInvoiceChanged();
  }

  initCompanyForm(): void {
    this.companyForm = this.fb.group({
      accountType: new FormControl('Company'),
      needInvoice: new FormControl(true),

      name: new FormControl('', Validators.required),
      website: new FormControl(''),
      vatTaxId: new FormControl('', Validators.required),

      invoiceAddress: new FormGroup({
        fullName: new FormControl(null, Validators.required),
        street: new FormControl(null, Validators.required),
        city: new FormControl(null),
        postalCode: new FormControl(null),
        country: new FormControl(null, Validators.required),
      }),
    })
    this.onCompanyInvoiceChanged();
  }

  initBusinessForm(): void {
    this.businessForm = new FormGroup({
      industry: new FormControl(null, [Validators.required]),
      industryOther: new FormControl<string | null>(null),

      companySize: new FormControl(null, [Validators.required] ),
      businessModel: new FormControl(null, [Validators.required]),

      mainGoal: new FormControl(null, [Validators.required]),
      mainGoalOther: new FormControl<string | null>(null),

      monthlyInquiriesVolume: new FormControl<string | null>(null),

      crmType: new FormControl(null),
      timezone: new FormControl<string | null>(Intl.DateTimeFormat().resolvedOptions().timeZone),
    }) as OnboardingStepSecondForm;
  }

  onPrivateInvoiceChanged(): void {
    this.privateForm.get('needInvoice')?.valueChanges.subscribe(value => {
      const controls = ['fullName', 'street', 'city', 'country', 'postalCode'];

      controls.forEach(name => {
        const invoiceAddressControl = this.privateForm.get('invoiceAddress') as FormGroup;
        const control = invoiceAddressControl.get(name);
        if (!control) return;

        if (value) {
          control.addValidators(Validators.required);
        } else {
          control.removeValidators(Validators.required);
        }

        control.updateValueAndValidity();
      });
    });
  }

  onCompanyInvoiceChanged(): void {
    this.companyForm.get('needInvoice')?.valueChanges.subscribe(value => {
      const controls = ['fullName', 'street', 'city', 'country', 'postalCode'];

      controls.forEach(name => {
        const invoiceAddressControl = this.companyForm.get('invoiceAddress') as FormGroup;
        const control = invoiceAddressControl.get(name);
        if (!control) return;

        if (value) {
          control.addValidators(Validators.required);
        } else {
          control.removeValidators(Validators.required);
        }

        control.updateValueAndValidity();
      });
    });
  }

  isInvalidPrivateControl(controlName: string, childForm?: string) {
    let control = this.privateForm.get(controlName);
    if (childForm) {
      const invoiceAddressForm = this.privateForm.get(childForm) as FormGroup;
      control = invoiceAddressForm.get(controlName);
    }
    return control?.invalid && (control.touched || this.privateFormSubmitted);
  }

  isInvalidCompanyControl(controlName: string, childForm?: string) {
    let control = this.companyForm.get(controlName);
    if (childForm) {
      const invoiceAddressForm = this.companyForm.get(childForm) as FormGroup;
      control = invoiceAddressForm.get(controlName);
    }
    return control?.invalid && (control.touched || this.companyFormSubmitted);
  }

  isInvalidBusinessControl(controlName: string) {
    const control = this.businessForm.get(controlName);
    return control?.invalid && (control.touched || this.businessFormSubmitted);
  }

  submitFirstStep(activateCallback: any): void {
    this.privateFormSubmitted = true;
    this.companyFormSubmitted = true;
    if (this.tabValue === 0 && this.privateForm.valid) {
      this.nextPrivateStep(activateCallback);
    }
    else if (this.companyForm.valid) {
      this.nextCompanyStep(activateCallback);
    }
  }

  nextPrivateStep(activateCallback: any): void {
    let firstStepModel: OnboardingStepFirstRequest;
    if (this.privateForm.get('needInvoice')?.value) {
      firstStepModel = this.privateForm.value;
    }
    else {
      const {accountType, needInvoice} = this.privateForm.value;
      firstStepModel = {
        needInvoice,
        accountType,
        invoiceAddress: null,
        companyInfo: null
      }
    }

    this.onboardingService.setOnboardingFirstStep(firstStepModel)
      .pipe(concatMap(() => this.onboardingService.getOnboardingStatus()))
      .subscribe(x => {
      this.companyForm.reset();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Onboarding I completed Successfully!', life: 2000 });
      this.firstStepCompleted = true;
      activateCallback(2);
    })
  }

  nextCompanyStep(activateCallback: any): void {

    let firstStepModel: OnboardingStepFirstRequest;
    const {accountType, needInvoice, invoiceAddress, name, vatTaxId, website} = this.companyForm.value;
    if (this.companyForm.get('needInvoice')?.value) {
      firstStepModel = {
        needInvoice,
        accountType,
        invoiceAddress,
        companyInfo: {
          name,
          vatTaxId,
          website,
        }
      }
    }
    else {
      firstStepModel = {
        needInvoice,
        accountType,
        invoiceAddress: null,
        companyInfo: {
          name,
          vatTaxId,
          website,
        }
      }
    }

    this.onboardingService.setOnboardingFirstStep(firstStepModel)
      .pipe(concatMap(() => this.onboardingService.getOnboardingStatus()))
      .subscribe(x => {
      this.companyForm.reset();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Onboarding I completed Successfully!', life: 2000 });
      activateCallback(2);
    })
  }

  completeOnboarding(): void {
    this.businessFormSubmitted = true;
    if (this.businessForm.valid) {
      this.onboardingService.setOnboardingSecondStep(this.businessForm.value).subscribe(x => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Onboarding completed Successfully!', life: 2000 });
        this.businessForm.reset();
        this.privateForm.reset()
        this.companyForm.reset()
        this.router.navigate(['/home'])
      })
    }
  }

  skipOnboarding(): void {
    this.onboardingService.skipOnboarding().subscribe(x => {
      this.router.navigate(['/home']);
    })
  }

  onStepChanged(stepValue: number | undefined): void {
    console.log(stepValue)
  }
  onTabChanged(tabValue: string | number | undefined): void {
    console.log(tabValue)
  }
}
