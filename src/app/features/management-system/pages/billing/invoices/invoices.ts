import {Component, inject, signal, WritableSignal} from '@angular/core';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {DatePipe, NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {CreateInvoice} from '../../../../../shared/dialogs/create-invoice/create-invoice';
import {UserStore} from '../../../../../core/stores/user.store';

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
    CreateInvoice
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class Invoices {
  userStore = inject(UserStore);
  visibleCreateInvoice: WritableSignal<boolean> = signal(false);
  invoices = [
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: -847.32, status: 'Sent'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: -299.00, status: 'Overdue'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: 3200.00, status: 'Paid'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: -299.00, status: 'Paid'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: 50.00,   status: 'Paid'},
    { invoice: 'INV-2026-0048', date: 'Mar 5, 2026', dueDate: 'Feb 28, 2026', amount: 0.00,    status: 'Paid'}
  ];

  getAmountClass(amount: number): string {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
  }
}
