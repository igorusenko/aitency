import { Component, inject, input, output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Textarea } from 'primeng/textarea';
import { BillingService } from '../../../core/services/management-system/billing/billing.service';
import { MessageService } from 'primeng/api';
import {
  BillingSubscriptionResponse,
  CancelBillingSubscriptionRequest
} from '../../../core/interfaces/billing/billing.interface';

@Component({
  selector: 'app-cancel-subscription-dialog',
  standalone: true,
  imports: [
    Dialog,
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

  visible = input.required<boolean>();
  subscription = input<BillingSubscriptionResponse | null>();

  canceled = output<BillingSubscriptionResponse>();
  visibleChange = output<boolean>();

  form: FormGroup = this.fb.group({
    reason: [''],
  });

  save(): void {
    if (!this.subscription()) return;

    const request: CancelBillingSubscriptionRequest = this.form.value;
    this.billingService.cancelSubscription(this.subscription()!.id, request).subscribe({
      next: (subscription) => {
        this.canceled.emit(subscription);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subscription canceled successfully' });
        this.close();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to cancel subscription' });
      }
    });
  }

  close(): void {
    this.visibleChange.emit(false);
    this.form.reset();
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }
}
