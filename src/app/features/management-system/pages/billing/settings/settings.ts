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
import {OnboardingService} from '../../../../../core/services/management-system/onboarding/onboarding.service';
import {BillingSettingsService} from '../../../../../core/services/management-system/billing/billing-settings.service';

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
  onboardingService = inject(OnboardingService);
  billingSettingsService= inject(BillingSettingsService);
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
    autoRechargeEnabled: [false],
    autoRechargeThreshold: [0],
    autoRechargeAmount: [0]
  });

  notificationForm: FormGroup = this.fb.group({
    invoiceIssuedEnabled: [false],
    paymentReceivedEnabled: [false],
    subscriptionRenewalReminderEnabled: [false],
    lowBalanceAlertEnabled: [false],
    overdueInvoiceReminderEnabled: [false],
    newFeatureAnnouncementEnabled: [false]
  });

  notifications = [
    { controlName: 'invoiceIssuedEnabled', label: 'Invoice issued notifications' },
    { controlName: 'paymentReceivedEnabled', label: 'Payment received notifications' },
    { controlName: 'subscriptionRenewalReminderEnabled', label: 'Subscription renewal reminders' },
    { controlName: 'lowBalanceAlertEnabled', label: 'Low balance alerts' },
    { controlName: 'overdueInvoiceReminderEnabled', label: 'Invoice reminder alerts' },
    { controlName: 'newFeatureAnnouncementEnabled', label: 'New feature announcements' },
  ];

  ngOnInit() {
    this.getBillingSettings();
  }

  getBillingSettings(): void {
    // if (!this.onboardingService.onboardingStatus()?.step) return;
    this.billingSettingsService.getBillingSettings().subscribe(settings => {
      this.autoRechargeForm.setValue(settings.autoRechargeSettings);
      this.notificationForm.setValue(settings.notificationPreferences);
      this.billingForm.setValue(settings.billingDetails);
    })
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
    this.billingSettingsService.updateAutoRecharge(this.autoRechargeForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Auto-recharge settings saved successfully!' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save auto-recharge settings. Please try again.' });
      }
    })
  }

  saveNotificationSettings(): void {
    this.billingSettingsService.updateNotificationPreferences(this.notificationForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Notification preferences saved successfully!' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save notification preferences. Please try again.' });
      }
    })
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
      width: '35rem',
      closable: true,
    });
    this.ref?.onClose.subscribe(() => {
      this.refreshPaymentMethods();
    });
  }
}
