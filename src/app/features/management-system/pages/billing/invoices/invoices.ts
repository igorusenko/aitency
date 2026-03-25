import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {DatePipe, NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {CreateInvoice} from '../../../../../shared/dialogs/create-invoice/create-invoice';
import {UserStore} from '../../../../../core/stores/user.store';
import {InvoiceInfo} from '../../../../../shared/dialogs/invoice-info/invoice-info';
import {SelectComponent} from '../../../../../shared/select/select';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {InputTextComponent} from '../../../../../shared/input-text/input-text';
import { BillingService } from '../../../../../core/services/management-system/billing/billing.service';
import { BillingInvoiceListItemResponse, BillingInvoiceStatus } from '../../../../../core/interfaces/billing/billing.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    PrimeTemplate,
    TableModule,
    Tag,
    NgClass,
    DatePipe,
    Button,
    CreateInvoice,
    InvoiceInfo,
    SelectComponent,
    DatePicker,
    FloatLabel,
    InputTextComponent,
    ReactiveFormsModule
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class Invoices implements OnInit {
  userStore = inject(UserStore);
  fb = inject(FormBuilder);
  billingService = inject(BillingService);
  visibleCreateInvoice: WritableSignal<boolean> = signal(false);
  visibleInvoiceInfo: WritableSignal<boolean> = signal(false);
  filterForm: FormGroup;
  invoiceStatuses = [
    { name: 'All statuses', value: null },
    { name: 'Draft', value: BillingInvoiceStatus.Draft },
    { name: 'Issued', value: BillingInvoiceStatus.Issued },
    { name: 'Paid', value: BillingInvoiceStatus.Paid },
    { name: 'Overdue', value: BillingInvoiceStatus.Overdue },
    { name: 'Canceled', value: BillingInvoiceStatus.Canceled },
    { name: 'Refunded', value: BillingInvoiceStatus.Refunded },
  ]
  invoices: WritableSignal<BillingInvoiceListItemResponse[]> = signal([]);
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
      this.loadInvoices();
    });
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      status: new FormControl(''),
      invoiceNumber: new FormControl(''),
      dateIssuedFrom: new FormControl(null),
      dateIssuedTo: new FormControl(null),
    })
  }

  loadInvoices(event?: any): void {
    if (event) {
      this.page.set(event.first / event.rows + 1);
      this.rows.set(event.rows);
    }

    this.loading.set(true);
    const role = this.userStore.currentUser()?.role;
    const filters = this.filterForm.value;
    console.log(filters)
    const params: any = {
      page: this.page(),
      count: this.rows(),
      status: filters.status,
      invoiceNumber: filters.invoiceNumber,
      dateIssuedFrom: filters.dateIssuedFrom?.toISOString() ?? '',
      dateIssuedTo: filters.dateIssuedTo?.toISOString() ?? '',
    };

    const request$ = role === 'Admin'
      ? this.billingService.getAdminInvoices(params)
      : this.billingService.getInvoices(params);

    request$.subscribe({
      next: (response) => {
        this.invoices.set(response.items);
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

  getStatusSeverity(status: BillingInvoiceStatus): string {
    switch (status) {
      case BillingInvoiceStatus.Paid: return 'success';
      case BillingInvoiceStatus.Overdue: return 'danger';
      case BillingInvoiceStatus.Canceled: return 'secondary';
      case BillingInvoiceStatus.Draft: return 'info';
      case BillingInvoiceStatus.Issued: return 'warn';
      default: return 'info';
    }
  }
}
