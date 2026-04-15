import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {InputTextComponent} from '../../input-text/input-text';
import {BillingCouponsService} from '../../../core/services/management-system/billing/billing-coupons.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-redeem-dialog',
  imports: [
    ReactiveFormsModule,
    Button,
    InputTextComponent
  ],
  templateUrl: './redeem-dialog.html',
  styleUrl: './redeem-dialog.scss',
})
export class RedeemDialog {
  fb = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  couponsService = inject(BillingCouponsService);
  messageService = inject(MessageService);

  redeemForm: FormGroup = this.fb.group({
    couponCode: ['', Validators.required]
  });

  close(): void {
    this.ref.close();
  }

  redeemCoupon(): void {
    this.couponsService.redeem(this.redeemForm.value).subscribe({
      next: (result: any) => {
        if (result.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.error.message, life: 5000 });
          return;
        }

        this.ref.close(true);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Coupon applied successfully!', life: 2000 });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to apply coupon', life: 5000 });
      }
    })
  }
}
