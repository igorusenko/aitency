import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {CreateInvoice} from '../../../../../shared/dialogs/create-invoice/create-invoice';
import {DatePicker} from 'primeng/datepicker';
import {DatePipe, NgClass} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';
import {InputTextComponent} from '../../../../../shared/input-text/input-text';
import {InvoiceInfo} from '../../../../../shared/dialogs/invoice-info/invoice-info';
import {PrimeTemplate} from 'primeng/api';
import {SelectComponent} from '../../../../../shared/select/select';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {UserStore} from '../../../../../core/stores/user.store';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

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
    NgClass
  ],
  templateUrl: './payments.html',
  styleUrl: './payments.scss'
})
export class Payments implements OnInit {
  userStore = inject(UserStore);
  fb = inject(FormBuilder);
  visibleCreatePayment: WritableSignal<boolean> = signal(false);
  filterForm: FormGroup;
  invoiceStatuses = [
    { name: 'All types' },
    { name: 'Card' },
    { name: 'SEPA' },
    { name: 'Manual' },
  ]
  invoices = [
    { reference: 'SEPA-20260301-001', date: 'Mar 5, 2026', type: 'Payment', amount: -847.32, status: 'Sent', method: 'SEPA Transfer', notes: 'Q1 prepayment'},
    { reference: 'CARD-20260220-001', date: 'Mar 5, 2026', type: 'Adjustment', amount: -299.00, status: 'Overdue', method: 'Visa ****2847', notes: 'Invoice INV-2026-0046'},
    { reference: 'ADJ-20260215-001', date: 'Mar 5, 2026',  type: 'Payment', amount: 3200.00, status: 'Paid', method: 'Manual', notes: 'Early payment discount'},
    { reference: 'SEPA-20260301-001', date: 'Mar 5, 2026', type: 'Payment', amount: -299.00, status: 'Paid', method: 'SEPA Transfer', notes: 'Partial payment'},
    { reference: 'CARD-20260120-001', date: 'Mar 5, 2026', type: 'Payment', amount: 50.00,   status: 'Paid', method: 'MasterCard ****5521', notes: 'Invoice INV-2026-0044\n'},
  ];

  ngOnInit() {
    this.initFilterForm();
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      type: new FormControl(''),
      search: new FormControl(''),
    })
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
  }
}
