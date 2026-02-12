import {Component, inject, OnInit} from '@angular/core';
import {StepperModule} from 'primeng/stepper';
import {Button} from 'primeng/button';
import {TabsModule} from 'primeng/tabs';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Checkbox} from 'primeng/checkbox';
import {Message} from 'primeng/message';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-onboarding',
  imports: [StepperModule, Button, TabsModule, ReactiveFormsModule, Checkbox, Message, FloatLabel, InputText, RouterLink],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class Onboarding implements OnInit {
  fb = inject(FormBuilder);
  privateForm: FormGroup;
  companyForm: FormGroup;
  businessForm: FormGroup;
  privateFormSubmitted: boolean = false;
  companyFormSubmitted: boolean = false;
  tabs = [
    { title: 'Private person', value: 0, content: 'Tab 1 Content' },
    { title: 'Company', value: 1, content: 'Tab 2 Content' },
  ];
  tabValue = 0;
  stepValue = 1;

  industries = [
    'Healthcare / Medical',
    'Dental',
    'Aesthetics',
    'Real Estate',
    'Hospitality',
    'Retail',
    'E-commerce',
    'Professional services',
    'Construction',
    'Automotive',
    'Education',
    'Logistics',
    'Beauty',
    'Wellness',
    'Manufacturing',
    'IT / Software',
    'Other'
  ];
  companySizes = [
    'Solo',
    '2-10',
    '11-50',
    '51-200',
    '200+',
  ];
  businessModels = [
    'online',
    'offline',
    'hybrid',
  ];
  mainGoals = [
    'Get more leads',
    'Respond faster to inquiries',
    'Automate support',
    'Automate bookings',
    'Improve reporting',
    'Reduce workload',
    'Other'
  ];
  crms = [
    'None',
    'HubSpot',
    'Salesforce',
    'Zoho',
    'Odoo',
    'Pipedrive',
    'Other',
  ]

  ngOnInit() {
    this.initPrivateForm();
    this.initCompanyForm();
    this.initBusinessForm();
  }

  initPrivateForm(): void {
    this.privateForm = this.fb.group({
      invoice: new FormControl(false),
      fullName: new FormControl(''),
      address: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
      postIndex: new FormControl(''),
    })
    this.onPrivateInvoiceChanged();
  }

  initCompanyForm(): void {
    this.companyForm = this.fb.group({
      invoice: new FormControl(false),
      name: new FormControl('', Validators.required),
      website: new FormControl(''),
      tax: new FormControl(''),
      address: new FormControl(''),
    })
    this.onCompanyInvoiceChanged();
  }

  initBusinessForm(): void {
    this.businessForm = this.fb.group({
      industry: new FormControl(null, Validators.required),
      companySize: new FormControl(null, Validators.required),
      businessModel: new FormControl(null, Validators.required),
      mainGoal: new FormControl(null, Validators.required),
      monthlyInquiries: new FormControl(null),
      crm: new FormControl(null),
    })
  }

  onPrivateInvoiceChanged(): void {
    this.privateForm.get('invoice')?.valueChanges.subscribe(value => {
      const controls = ['fullName', 'address', 'city', 'country', 'postIndex'];

      controls.forEach(name => {
        const control = this.privateForm.get(name);
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
    this.companyForm.get('invoice')?.valueChanges.subscribe(value => {
      const control = this.companyForm.get('address')
      if (!control) return;

      if (value) control.addValidators(Validators.required);
      else control.removeValidators(Validators.required);

      control?.updateValueAndValidity();
    });
  }

  isInvalidPrivateControl(controlName: string) {
    const control = this.privateForm.get(controlName);
    return control?.invalid && (control.touched || this.privateFormSubmitted);
  }

  isInvalidCompanyControl(controlName: string) {
    const control = this.companyForm.get(controlName);
    return control?.invalid && (control.touched || this.companyFormSubmitted);
  }

  nextPrivateStep(activateCallback: any): void {
    this.privateFormSubmitted = true;
    console.log(this.privateForm)
    if (this.privateForm.valid) {
      this.companyForm.reset();
      activateCallback(2);
    }
  }

  nextCompanyStep(activateCallback: any): void {
    this.companyFormSubmitted = true;
    console.log(this.companyForm)
    if (this.companyForm.valid) {
      this.privateForm.reset();
      activateCallback(2);
    }
  }

  onStepChange(stepValue: number | undefined): void {
    // if (stepValue === 2) this.initBusinessForm();
  }
}
