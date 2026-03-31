import {Component, effect, inject, model, ModelSignal, output, signal} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../../../core/services/management-system/billing/billing.service';
import { BillingPaymentMethodResponse } from '../../../core/interfaces/billing/billing.interface';
import { InputNumberComponent } from '../../input-number/input-number';
import { SelectComponent } from '../../select/select';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { map, Observable, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StripeService } from 'ngx-stripe';
import { UserStore } from '../../../core/stores/user.store';
import {OnboardingService} from '../../../core/services/management-system/onboarding/onboarding.service';

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
  messageService = inject(MessageService);
  onboardingService = inject(OnboardingService);
  visible: ModelSignal<boolean> = model.required();
  onTopUp = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly billingService = inject(BillingService);
  private readonly router = inject(Router);
  private readonly stripeService = inject(StripeService);
  private readonly userStore = inject(UserStore);
  paymentMethods$: Observable<{ label: string, value: string, gatewayPaymentMethodId: string | null }[]>;

  constructor() {
    effect(() => {
      if (this.onboardingService.onboardingStatus()) {
        if (this.onboardingService.onboardingStatus()?.status !== 'NotStarted')
        this.paymentMethods$ = this.billingService.getPaymentMethods().pipe(
          map(methods => methods.map(m => ({
            label: `${m.brand} **** ${m.last4} ${m.isDefault ? '(Default)' : ''}`,
            value: m.id,
            gatewayPaymentMethodId: m.gatewayPaymentMethodId
          })))
        );
      }
    });
  }

  topUpForm = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.1)]],
    paymentMethodId: [null as string | null, [Validators.required]]
  });

  saving = signal(false);
  formSubmitted = signal(false);

  save() {
    this.formSubmitted.set(true);
    if (this.saving() || this.topUpForm.invalid) return;
    this.saving.set(true);

    const { amount, paymentMethodId } = this.topUpForm.getRawValue();

    this.paymentMethods$.pipe(
      map(methods => methods.find(m => m.value === paymentMethodId)),
      switchMap(selectedMethod => {
        return this.billingService.topUp({
          amount: amount as number,
          paymentMethodId: paymentMethodId as string,
          idempotencyKey: crypto.randomUUID(),
          returnUrl: window.location.origin + this.router.url
        }).pipe(
          switchMap(response => {
            if (response.clientSecret && selectedMethod?.gatewayPaymentMethodId) {
              return this.stripeService.confirmCardPayment(response.clientSecret, {
                payment_method: selectedMethod.gatewayPaymentMethodId
              } as any);
            }
            return of({ paymentIntent: { status: 'succeeded' }, error: null });
          })
        );
      })
    ).subscribe({
      next: (result: any) => {
        if (result.error) {
          this.saving.set(false);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: result.error.message, life: 5000 });
          return;
        }

        this.saving.set(false);
        this.visible.set(false);
        this.billingService.refreshBalance();
        this.onTopUp.emit();
        this.topUpForm.reset();
        this.formSubmitted.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Balance topped up successfully!', life: 2000 });
      },
      error: (err) => {
        this.saving.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error topping up balance', life: 5000 });
      }
    });
  }
}
