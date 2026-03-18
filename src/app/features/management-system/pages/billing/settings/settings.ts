import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from '../../../../../shared/checkbox/checkbox';
import { InputNumberComponent } from '../../../../../shared/input-number/input-number';
import { InputTextComponent } from '../../../../../shared/input-text/input-text';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextComponent,
    InputNumberComponent,
    Checkbox
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  private fb = inject(FormBuilder);

  billingForm: FormGroup = this.fb.group({
    companyName: ['TechFlow Solutions Ltd'],
    vatNumber: ['EL999999999'],
    address: [''],
    city: [''],
    country: [''],
    email: ['billing@techflow.gr']
  });

  autoRechargeForm: FormGroup = this.fb.group({
    enabled: [true],
    threshold: [500],
    amount: [2000]
  });

  notificationForm: FormGroup = this.fb.group({
    invoiceIssued: [true],
    paymentReceived: [true],
    renewalReminders: [true],
    lowBalance: [true],
    usageAlerts: [false],
    marketing: [false]
  });

  paymentMethods = [
    {
      icon: '💳',
      name: 'Visa ending in 2847',
      detail: 'Expires: 12/2027 • Default',
      isDefault: true
    },
    {
      icon: '💳',
      name: 'MasterCard ending in 5521',
      detail: 'Expires: 08/2025',
      isDefault: false
    },
    {
      icon: '🏦',
      name: 'IBAN: GR89...8714',
      detail: 'SEPA Transfer • Default for large payments',
      isDefault: true
    }
  ];

  notifications = [
    { controlName: 'invoiceIssued', label: 'Invoice issued notifications' },
    { controlName: 'paymentReceived', label: 'Payment received notifications' },
    { controlName: 'renewalReminders', label: 'Subscription renewal reminders' },
    { controlName: 'lowBalance', label: 'Low balance alerts' },
    { controlName: 'usageAlerts', label: 'Usage threshold alerts' },
    { controlName: 'marketing', label: 'Billing-related marketing' }
  ];

  updateBillingDetails() {
    console.log('Update Billing Details', this.billingForm.value);
  }

  saveAutoRecharge() {
    console.log('Save Auto-Recharge', this.autoRechargeForm.value);
  }
}
