import { CommonModule } from '@angular/common';
import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from '../../../../../shared/checkbox/checkbox';
import { InputNumberComponent } from '../../../../../shared/input-number/input-number';
import { InputTextComponent } from '../../../../../shared/input-text/input-text';
import {BillingService} from '../../../../../core/services/management-system/billing/billing.service';
import {UserStore} from '../../../../../core/stores/user.store';
import {MessageService} from 'primeng/api';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
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
    Checkbox
  ],
  providers: [DialogService],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {
  private fb = inject(FormBuilder);
  billingService = inject(BillingService);
  userStore = inject(UserStore);
  messageService = inject(MessageService);
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null;
  paymentMethods$ = this.billingService.getPaymentMethods();
  billingDetailsLoader: boolean = false;

  billingForm: FormGroup = this.fb.group({
    companyName: [''],
    vatNumber: [''],
    streetAddress: [''],
    city: [''],
    state: [''],
    zip: [''],
    billingEmail: ['']
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

  ngOnInit() {
    this.getClient();
  }

  getClient(): void {
    this.billingService.getProfile().subscribe(client => {
      this.billingForm.patchValue({
        companyName: client.companyName,
        vatNumber: client.vatNumber,
        billingEmail: client.billingEmail,
        streetAddress: client.streetAddress,
        city: client.city,
        state: client.state,
        zip: client.zip
      });
    });
  }

  updateBillingDetails(): void {
    this.billingDetailsLoader = true;
    this.billingService.updateCurrentClient(this.billingForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Billing details updated successfully!' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update billing details. Please try again.' });
      },
      complete: () => {
        this.billingDetailsLoader = false;
      }
    })
  }

  saveAutoRecharge(): void {

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

  openCreatePaymentMethodDialog() {
    this.ref = this.dialogService.open(CreatePaymentMethod, {
      header: 'Add Payment Method',
      width: '35rem'
    });
    this.ref?.onClose.subscribe(() => {
      this.refreshPaymentMethods();
    });
  }
}
