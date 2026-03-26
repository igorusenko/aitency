import {Component, effect, inject, input, InputSignal, model, ModelSignal, OnInit} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {UserStore} from '../../../core/stores/user.store';
import {BillingService} from '../../../core/services/management-system/billing/billing.service';
import {BillingInvoiceResponse} from '../../../core/interfaces/billing/billing.interface';
import {Observable} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-invoice-info',
  imports: [
    Dialog,
    Button,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './invoice-info.html',
  styleUrl: './invoice-info.scss',
})
export class InvoiceInfo {
  userStore = inject(UserStore);
  billingService = inject(BillingService);
  invoice$: Observable<BillingInvoiceResponse>;
  visible: ModelSignal<boolean> = model.required();
  invoice: ModelSignal<BillingInvoiceResponse | null> = model.required();

  constructor() {
    effect(() => {
      if (this.invoice()?.id)
        this.getInvoiceById();
    });
  }

  getInvoiceById(): void {
    if (this.userStore.currentUser().role === 'Admin')
      this.invoice$ = this.billingService.getAdminInvoiceById(this.invoice()?.id!)
    else
      this.invoice$ = this.billingService.getInvoiceById(this.invoice()?.id!)
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
  }
}
