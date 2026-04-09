import {Component, inject, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {UserStore} from '../../../core/stores/user.store';
import {BillingService} from '../../../core/services/management-system/billing/billing.service';
import {BillingInvoiceResponse} from '../../../core/interfaces/billing/billing.interface';
import {Observable} from 'rxjs';
import {AsyncPipe, DatePipe} from '@angular/common';
import {DynamicDialogRef, DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-invoice-info',
  imports: [
    Button,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './invoice-info.html',
  styleUrl: './invoice-info.scss',
})
export class InvoiceInfo implements OnInit {
  userStore = inject(UserStore);
  billingService = inject(BillingService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  invoice$: Observable<BillingInvoiceResponse> | null = null;
  invoiceId: string = this.config.data?.invoiceId || '';

  ngOnInit(): void {
    if (this.invoiceId) {
      this.getInvoiceById();
    }
  }

  getInvoiceById(): void {
    if (this.userStore.userRole === 'Admin')
      this.invoice$ = this.billingService.getAdminInvoiceById(this.invoiceId);
    else
      this.invoice$ = this.billingService.getInvoiceById(this.invoiceId);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
  }

  close(): void {
    this.ref.close();
  }
}
