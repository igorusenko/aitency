import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {Button} from 'primeng/button';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {InputNumberModule} from 'primeng/inputnumber';
import {BillingCouponsService} from '../../../core/services/management-system/billing/billing-coupons.service';
import {CreateBillingCouponRequest, BillingCouponResponse, BillingCouponType} from '../../../core/interfaces/billing/billing-coupons.interface';
import {InputTextComponent} from '../../input-text/input-text';
import {SelectComponent} from '../../select/select';
import {InputNumberComponent} from '../../input-number/input-number';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-create-coupon',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputText, Select, InputNumberModule, InputTextComponent, SelectComponent, InputNumberComponent, DatePicker, FloatLabel],
  templateUrl: './create-coupon.html'
})
export class CreateCouponDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly couponsService = inject(BillingCouponsService);

  formSubmitted: WritableSignal<boolean> = signal(false);

  couponTypeOptions = [
    { label: 'Percentage', value: BillingCouponType.PercentageDiscount },
    { label: 'Fixed', value: BillingCouponType.FixedDiscount },
    { label: 'Virtual deposit', value: BillingCouponType.VirtualDeposit }
  ];

  form = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(64)]],
    type: [BillingCouponType.FixedDiscount, Validators.required],
    value: [1, [Validators.required, Validators.min(0.01)]],
    expiryDate: [null as Date | string | null],
    usageLimit: [null as number | null],
    maxPerClient: [null as number | null]
  });

  ngOnInit(): void {}

  save(): void {
    this.formSubmitted.set(true);
    if (this.form.invalid) return;

    const v = this.form.value;
    const expiryDate: string | null = v.expiryDate instanceof Date
      ? v.expiryDate.toISOString()
      : (typeof v.expiryDate === 'string' && v.expiryDate.trim() !== '' ? v.expiryDate : null);

    const payload: CreateBillingCouponRequest = {
      code: (v.code || '').toString(),
      type: v.type!,
      value: Number(v.value),
      expiryDate,
      usageLimit: v.usageLimit ?? null,
      maxPerClient: v.maxPerClient ?? null
    };

    this.couponsService.createAdminCoupon(payload).subscribe({
      next: (res: BillingCouponResponse) => this.ref.close(res),
      error: () => this.ref.close(null)
    });
  }

  close(): void {
    this.ref.close(null);
  }
}
