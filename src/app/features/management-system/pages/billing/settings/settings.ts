import { CommonModule } from '@angular/common';
import {Component, inject, signal, WritableSignal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from '../../../../../shared/checkbox/checkbox';
import { InputNumberComponent } from '../../../../../shared/input-number/input-number';
import { InputTextComponent } from '../../../../../shared/input-text/input-text';
import {BillingService} from '../../../../../core/services/management-system/billing/billing.service';
import {CreatePaymentMethod} from '../../../../../shared/dialogs/create-payment-method/create-payment-method';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextComponent,
    InputNumberComponent,
    Checkbox,
    CreatePaymentMethod
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  private fb = inject(FormBuilder);
  billingService = inject(BillingService);
  visibleCreatePaymentMethod: WritableSignal<boolean> = signal(false);
  paymentMethods$ = this.billingService.getPaymentMethods();

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

  setDefault(id: string) {
    this.billingService.setDefaultPaymentMethod(id).subscribe(() => {
      this.refreshPaymentMethods();
    });
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    this.billingService.deletePaymentMethod(id).subscribe(() => {
      this.refreshPaymentMethods();
    });
  }

  refreshPaymentMethods() {
    this.paymentMethods$ = this.billingService.getPaymentMethods();
  }

  getIcon(brand: string | null): string {
    if (!brand) return '💳';
    const b = brand.toLowerCase();
    if (b.includes('visa')) return '💳';
    if (b.includes('mastercard')) return '💳';
    if (b.includes('amex')) return '💳';
    return '💳';
  }
}
