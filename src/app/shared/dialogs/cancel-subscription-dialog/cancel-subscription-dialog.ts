import { Component, inject } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Textarea } from 'primeng/textarea';
import { BillingService } from '../../../core/services/management-system/billing/billing.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  BillingSubscriptionResponse,
  CancelBillingSubscriptionRequest
} from '../../../core/interfaces/billing/billing.interface';

@Component({
  selector: 'app-cancel-subscription-dialog',
  standalone: true,
  imports: [
    Button,
    ReactiveFormsModule,
    FloatLabel,
    Textarea,
  ],
  templateUrl: './cancel-subscription-dialog.html',
  styleUrl: './cancel-subscription-dialog.scss'
})
export class CancelSubscriptionDialog {
  fb = inject(FormBuilder);
  billingService = inject(BillingService);
  messageService = inject(MessageService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  subscription: BillingSubscriptionResponse | null = this.config.data?.subscription || null;

  form: FormGroup = this.fb.group({
    reason: [''],
  });

  save(): void {
    if (!this.subscription) return;

    const request: CancelBillingSubscriptionRequest = this.form.value;
    this.billingService.cancelSubscription(this.subscription.id, request).subscribe({
      next: (subscription) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subscription canceled successfully' });
        this.ref.close(subscription);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to cancel subscription' });
      }
    });
  }

  close(): void {
    this.ref.close();
    this.form.reset();
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }
}
