import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {SelectComponent} from '../../select/select';
import {BillingService} from '../../../core/services/management-system/billing/billing.service';
import {BillingPaymentMethodResponse, BillingInvoiceListItemResponse} from '../../../core/interfaces/billing/billing.interface';
import {MessageService} from 'primeng/api';
import {UserStore} from '../../../core/stores/user.store';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {StripeService} from 'ngx-stripe';
import {Router} from '@angular/router';
import {switchMap, of} from 'rxjs';
import {DynamicDialogRef, DynamicDialogConfig} from 'primeng/dynamicdialog';
import {InputTextComponent} from '../../input-text/input-text';
import {BillingCouponsService} from '../../../core/services/management-system/billing/billing-coupons.service';

@Component({
  selector: 'app-pay-invoice',
  imports: [
    Button,
    SelectComponent,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent
  ],
  templateUrl: './pay-invoice.html',
  styleUrl: './pay-invoice.scss',
})
export class PayInvoice implements OnInit {
  billingService = inject(BillingService);
  messageService = inject(MessageService);
  userStore = inject(UserStore);
  stripeService = inject(StripeService);
  router = inject(Router);
  fb = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  couponsService = inject(BillingCouponsService);

  invoice: BillingInvoiceListItemResponse = this.config.data?.invoice;

  invoiceForm: FormGroup = this.fb.group({
    paymentMethod: [''],
    couponCode: ['']
  });

  paymentMethods: WritableSignal<BillingPaymentMethodResponse[]> = signal([]);
  applyingCoupon = signal(false);

  ngOnInit(): void {
    if (this.userStore.userRole !== 'Admin')
      this.loadPaymentMethods();
  }

  // Explicit apply-coupon action from the dialog button
  applyCoupon(): void {
    if (!this.invoice) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invoice not provided', life: 2000 });
      return;
    }

    const rawCode: string = (this.invoiceForm.value.couponCode || '').toString().trim();
    if (!rawCode) {
      this.messageService.add({ severity: 'warn', summary: 'Coupon', detail: 'Please enter a coupon code', life: 2000 });
      return;
    }

    this.applyingCoupon.set(true);
    this.couponsService.applyDiscount({ invoiceId: this.invoice.id, couponCode: rawCode }).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Coupon applied', detail: `Discount: ${res.appliedAmount} ${res.currency}` , life: 3000 });
        this.applyingCoupon.set(false);
      },
      error: (err) => {
        const detail = err?.error?.message || 'Failed to apply coupon. Please check the code or invoice status.';
        this.messageService.add({ severity: 'error', summary: 'Coupon error', detail, life: 5000 });
        this.applyingCoupon.set(false);
      }
    });
  }

  loadPaymentMethods(): void {
    this.billingService.getPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods.set(methods.filter(m => m.isActive));
        if (methods.length > 0) {
          const defaultMethod = methods.find(m => m.isDefault);
          if (defaultMethod)
            this.invoiceForm.get('paymentMethod')?.setValue(defaultMethod.id);
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load payment methods', life: 2000 });
      }
    });
  }

  payInvoice(): void {
    if (!this.invoice || !this.invoiceForm.value.paymentMethod) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a payment method', life: 2000 });
      return;
    }

    const selectedMethod = this.paymentMethods().find(m => m.id === this.invoiceForm.value.paymentMethod);
    if (!selectedMethod) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Selected payment method not found', life: 2000 });
      return;
    }

    const proceedToPayment = () => {
      const request = {
        paymentMethodId: this.invoiceForm.value.paymentMethod,
        idempotencyKey: `invoice-${this.invoice!.id}-${Date.now()}`,
        returnUrl: window.location.origin + this.router.url
      };

      this.billingService.payInvoice(this.invoice!.id, request).pipe(
        switchMap(response => {
          if (response.clientSecret && selectedMethod.gatewayPaymentMethodId) {
            return this.stripeService.confirmCardPayment(response.clientSecret, {
              payment_method: selectedMethod.gatewayPaymentMethodId
            } as any);
          }
          return of({ paymentIntent: { status: 'succeeded' }, error: null });
        })
      ).subscribe({
        next: (result: any) => {
          if (result.error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.error.message, life: 5000 });
            return;
          }

          this.ref.close(true);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Invoice paid successfully!', life: 2000 });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to pay invoice', life: 5000 });
        }
      });
    };

    const rawCode: string = (this.invoiceForm.value.couponCode || '').toString().trim();
    if (rawCode.length > 0) {
      // Try to apply discount coupon first
      this.couponsService.applyDiscount({ invoiceId: this.invoice.id, couponCode: rawCode }).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Coupon applied', detail: `Discount: ${res.appliedAmount} ${res.currency}` , life: 3000 });
          proceedToPayment();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Coupon error', detail: 'Failed to apply coupon. Please check the code or invoice status.', life: 5000 });
        }
      });
    } else {
      proceedToPayment();
    }
  }

  close(): void {
    this.ref.close();
  }

  getPaymentMethodOptions(): Array<{ label: string; value: string }> {
    return this.paymentMethods().map(method => ({
      label: method.label || `${method.brand} **** ${method.last4}`,
      value: method.id
    }));
  }
}
