import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {DatePipe, NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {CreateInvoice} from '../../../../../shared/dialogs/create-invoice/create-invoice';
import {UserStore} from '../../../../../core/stores/user.store';
import {InvoiceInfo} from '../../../../../shared/dialogs/invoice-info/invoice-info';
import {PayInvoice} from '../../../../../shared/dialogs/pay-invoice/pay-invoice';
import {SelectComponent} from '../../../../../shared/select/select';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {InputTextComponent} from '../../../../../shared/input-text/input-text';
import { BillingService } from '../../../../../core/services/management-system/billing/billing.service';
import {
  BillingInvoiceListItemResponse,
  BillingInvoiceResponse,
  BillingInvoiceStatus
} from '../../../../../core/interfaces/billing/billing.interface';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

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
    SelectComponent,
    DatePicker,
    FloatLabel,
    InputTextComponent,
    ReactiveFormsModule
  ],
  providers: [DialogService],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class Invoices implements OnInit {
  userStore = inject(UserStore);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  billingService = inject(BillingService);
  dialogService = inject(DialogService);

  dialogRef: DynamicDialogRef | null = null;

  filterForm: FormGroup;
  invoiceStatuses = [
    { name: 'All statuses', value: '' },
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
    const role = this.userStore.userRole;
    const filters = this.filterForm.value;
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

  openCreateInvoiceDialog(): void {
    this.dialogRef = this.dialogService.open(CreateInvoice, {
      header: 'Create new invoice',
      width: '35rem'
    });
    this.dialogRef?.onClose.subscribe(() => {
      this.loadInvoices();
    });
  }

  viewInvoice(invoice: BillingInvoiceListItemResponse): void {
    this.dialogRef = this.dialogService.open(InvoiceInfo, {
      header: 'Invoice details',
      width: '35rem',
      data: { invoiceId: invoice.id }
    });
  }

  payInvoice(invoice: BillingInvoiceListItemResponse): void {
    this.dialogRef = this.dialogService.open(PayInvoice, {
      header: 'Pay Invoice',
      width: '35rem',
      data: { invoice }
    });
    this.dialogRef?.onClose.subscribe((success: boolean) => {
      if (success) {
        this.loadInvoices();
      }
    });
  }

  releaseInvoice(invoiceId: string): void {
    this.billingService.issueAdminInvoice(invoiceId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Invoice issued!', life: 2000 });
      this.loadInvoices();
    })
  }

  cancelInvoice(invoiceId: string): void {
    this.billingService.cancelAdminInvoice(invoiceId).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Invoice cancelled!', life: 2000 });
      this.loadInvoices();
    })
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'Cancelled': return 'danger';
      case 'Draft': return 'secondary';
      case 'Overdue': return 'warn';
      case 'Issued': return 'info';
      case 'Paid': return 'primary';
    }
  }
}
