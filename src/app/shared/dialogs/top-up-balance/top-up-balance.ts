import { Component, inject, model, ModelSignal, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../../../core/services/management-system/billing/billing.service';
import { InputNumberComponent } from '../../input-number/input-number';
import { SelectComponent } from '../../select/select';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-up-balance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberComponent,
    SelectComponent,
    ButtonModule,
    Dialog
  ],
  templateUrl: './top-up-balance.html',
})
export class TopUpBalance {
  visible: ModelSignal<boolean> = model.required();
  onTopUp = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly billingService = inject(BillingService);
  private readonly router = inject(Router);

  paymentMethods$: Observable<{ label: string, value: string }[]> = this.billingService.getPaymentMethods().pipe(
    map(methods => methods.map(m => ({
      label: `${m.brand} **** ${m.last4} ${m.isDefault ? '(Default)' : ''}`,
      value: m.id
    })))
  );

  topUpForm = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
    paymentMethodId: [null as string | null, [Validators.required]]
  });

  saving = signal(false);
  formSubmitted = signal(false);

  save() {
    this.formSubmitted.set(true);
    if (this.saving() || this.topUpForm.invalid) return;
    this.saving.set(true);

    const { amount, paymentMethodId } = this.topUpForm.getRawValue();

    this.billingService.topUp({
      amount: amount as number,
      paymentMethodId: paymentMethodId as string,
      idempotencyKey: crypto.randomUUID(),
      returnUrl: window.location.origin + this.router.url
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.visible.set(false);
        this.onTopUp.emit();
        this.topUpForm.reset();
        this.formSubmitted.set(false);
      },
      error: (err) => {
        this.saving.set(false);
        alert('Error topping up balance');
      }
    });
  }
}
