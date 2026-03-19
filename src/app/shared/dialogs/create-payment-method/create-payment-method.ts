import {Component, inject, model, ModelSignal, signal, ViewChild} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {injectStripe, StripeElementsDirective, StripePaymentElementComponent} from 'ngx-stripe';
import {BillingService} from '../../../core/services/management-system/billing/billing.service';
import {
  StripeElementsOptions,
  StripePaymentElementOptions
} from '@stripe/stripe-js';
import {BillingPaymentGateway} from '../../../core/interfaces/billing/billing.interface';
import {InputTextComponent} from '../../input-text/input-text';
import {Checkbox} from '../../checkbox/checkbox';
import {ButtonModule} from 'primeng/button';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-create-payment-method',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    Checkbox,
    ButtonModule,
    StripePaymentElementComponent,
    StripeElementsDirective,
    Dialog
  ],
  templateUrl: './create-payment-method.html',
  styleUrl: './create-payment-method.scss',
})
export class CreatePaymentMethod {
  visible: ModelSignal<boolean> = model.required();
  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;

  private readonly fb = inject(FormBuilder);
  private readonly billingService = inject(BillingService);

  paymentElementForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    address: [''],
    zipcode: [''],
    city: [''],
    setAsDefault: [true]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    mode: 'setup',
    currency: 'usd',
    paymentMethodCreation: 'manual',
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#101827',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    }
  };

  stripe = injectStripe();
  saving = signal(false);
  formSubmitted = signal(false);

  save() {
    this.formSubmitted.set(true);
    if (this.saving() || this.paymentElementForm.invalid) return;
    this.saving.set(true);

    const { name, email, address, zipcode, city, setAsDefault } = this.paymentElementForm.getRawValue();

    this.paymentElement.elements.submit().then(submitResult => {
      if (submitResult.error) {
        this.saving.set(false);
        alert(submitResult.error.message);
        return;
      }

      this.stripe
        .createPaymentMethod({
          elements: this.paymentElement.elements,
          params: {
            billing_details: {
              name: name as string,
              email: email as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                city: city as string
              }
            }
          }
        })
        .subscribe(result => {
          if (result.error) {
            this.saving.set(false);
            alert(result.error.message);
          } else {
            this.billingService.addPaymentMethod({
              gateway: BillingPaymentGateway.Stripe,
              gatewayPaymentMethodId: result.paymentMethod.id,
              setAsDefault: !!setAsDefault
            }).subscribe({
              next: () => {
                this.saving.set(false);
                this.visible.set(false);
              },
              error: (err) => {
                this.saving.set(false);
                alert('Error saving payment method to backend');
              }
            });
          }
        });
    })
  }
}
