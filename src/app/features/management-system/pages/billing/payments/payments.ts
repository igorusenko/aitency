import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {DatePipe, NgClass} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';
import {InputTextComponent} from '../../../../../shared/input-text/input-text';
import {PrimeTemplate} from 'primeng/api';
import {SelectComponent} from '../../../../../shared/select/select';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {UserStore} from '../../../../../core/stores/user.store';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { BillingService } from '../../../../../core/services/management-system/billing/billing.service';
import { BillingPaymentGateway, BillingPaymentListItemResponse, BillingPaymentStatus } from '../../../../../core/interfaces/billing/billing.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    Button,
    DatePicker,
    DatePipe,
    FloatLabel,
    InputTextComponent,
    PrimeTemplate,
    SelectComponent,
    TableModule,
    Tag,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './payments.html',
  styleUrl: './payments.scss'
})
export class Payments implements OnInit {
  userStore = inject(UserStore);
  fb = inject(FormBuilder);
  billingService = inject(BillingService);
  visibleCreatePayment: WritableSignal<boolean> = signal(false);
  filterForm: FormGroup;
  paymentGateways = [
    { name: 'All gateways', value: '' },
    { name: 'Stripe', value: BillingPaymentGateway.Stripe },
    { name: 'Mollie', value: BillingPaymentGateway.Mollie },
    { name: 'Manual', value: BillingPaymentGateway.Manual },
  ]
  payments: WritableSignal<BillingPaymentListItemResponse[]> = signal([]);
  totalCount = signal(0);
  loading = signal(false);
  page = signal(1);
  rows = signal(20);

  ngOnInit() {
    this.initFilterForm();

    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page.set(1);
      this.loadPayments();
    });
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      type: new FormControl(''),
      reference: new FormControl(''),
      createdAtFrom: new FormControl(null),
      createdAtTo: new FormControl(null),
    })
  }

  loadPayments(event?: any): void {
    if (event) {
      this.page.set(event.first / event.rows + 1);
      this.rows.set(event.rows);
    }

    this.loading.set(true);
    const role = this.userStore.userRole;
    const filters = this.filterForm.value;

    const params: any = {
      page: this.page(),
      count: this.rows(),
      type: filters.type,
      reference: filters.reference,
      createdAtFrom: filters.createdAtFrom?.toISOString() ?? '',
      createdAtTo: filters.createdAtTo?.toISOString() ?? '',
    };

    const request$ = role === 'Admin'
      ? this.billingService.getAdminPayments(params)
      : this.billingService.getPayments(params);

    request$.subscribe({
      next: (response) => {
        this.payments.set(response.items);
        this.totalCount.set(response.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getAmountClass(amount: number): string {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  }

  formatCurrency(value: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(value);
  }

  getControl(control: string): FormControl {
    return this.filterForm.get(control) as FormControl;
  }

  getStatusSeverity(status: BillingPaymentStatus): any {
    switch (status) {
      case BillingPaymentStatus.Completed: return 'success';
      case BillingPaymentStatus.Processing: return 'warn';
      case BillingPaymentStatus.Pending: return 'info';
      case BillingPaymentStatus.Failed: return 'danger';
      case BillingPaymentStatus.Canceled: return 'secondary';
      case BillingPaymentStatus.Refunded: return 'secondary';
      case BillingPaymentStatus.PartiallyRefunded: return 'warn';
      default: return 'info';
    }
  }
}
