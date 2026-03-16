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
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {InputTextComponent} from '../../../../../shared/input-text/input-text';

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
    InputTextComponent
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class Invoices implements OnInit {
  userStore = inject(UserStore);
  fb = inject(FormBuilder);
  visibleCreateInvoice: WritableSignal<boolean> = signal(false);
  visibleInvoiceInfo: WritableSignal<boolean> = signal(false);
  filterForm: FormGroup;
  invoiceStatuses = [
    { name: 'All statuses' },
    { name: 'Draft' },
    { name: 'Send' },
    { name: 'Paid' },
    { name: 'Overdue' },
  ]
  invoices = [
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: -847.32, status: 'Sent'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: -299.00, status: 'Overdue'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: 3200.00, status: 'Paid'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: -299.00, status: 'Paid'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: 50.00,   status: 'Paid'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: 0.00,    status: 'Paid'}
  ];

  ngOnInit() {
    this.initFilterForm();
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      status: new FormControl(''),
      search: new FormControl(''),
    })
  }

  getAmountClass(amount: number): string {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
  }
}
