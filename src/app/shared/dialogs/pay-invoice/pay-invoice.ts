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

@Component({
  selector: 'app-pay-invoice',
  imports: [
    Button,
    SelectComponent,
    FormsModule,
    ReactiveFormsModule
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

  invoice: BillingInvoiceListItemResponse = this.config.data?.invoice;

  invoiceForm: FormGroup = this.fb.group({
    paymentMethod: ['']
  });

  paymentMethods: WritableSignal<BillingPaymentMethodResponse[]> = signal([]);

  ngOnInit(): void {
    if (this.userStore.userRole !== 'Admin')
      this.loadPaymentMethods();
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
