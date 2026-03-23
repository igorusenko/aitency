import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import {BillingService} from '../../../../../core/services/management-system/billing/billing.service';
import {TopUpBalance} from '../../../../../shared/dialogs/top-up-balance/top-up-balance';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule, TagModule, TopUpBalance],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class BillingOverview {
  billingService = inject(BillingService);
  balance$ = this.billingService.getBalance();
  visibleTopUpDialog = signal(false);
  clientInfo = {
    companyName: 'TechFlow Solutions Ltd',
    vatNumber: 'EL999999999',
    email: 'billing@techflow.gr',
    location: 'Athens, Greece',
    joined: 'Jan 15, 2024'
  };

  accountBalance = 2450.00;

  dashboardCards = [
    { title: 'Active Subscriptions', value: '2', subtitle: 'AI Automation Pro + API Usage' },
    { title: 'Outstanding Invoices', value: '1', subtitle: 'INV-2026-0047 overdue 5 days' },
    { title: "This Month's Usage", value: '€847.32', subtitle: 'API calls and custom work' },
    { title: 'Last Payment', value: 'Mar 1, 2026', subtitle: '€3,200.00 via SEPA transfer' }
  ];

  transactions = [
    { date: 'Mar 8, 2026', description: 'Usage charge - API calls (45,231)', type: 'Usage', amount: -847.32, balance: 2450.00, status: 'warning' },
    { date: 'Mar 5, 2026', description: 'Invoice INV-2026-0047 generated', type: 'Invoice', amount: -299.00, balance: 3297.32, status: 'danger' },
    { date: 'Mar 1, 2026', description: 'SEPA transfer received', type: 'Payment', amount: 3200.00, balance: 3596.32, status: 'success' },
    { date: 'Feb 28, 2026', description: 'Subscription renewal - AI Automation Pro', type: 'Subscription', amount: -299.00, balance: 396.32, status: 'info' },
    { date: 'Feb 25, 2026', description: 'Manual balance adjustment (credit note)', type: 'Adjustment', amount: 50.00, balance: 695.32, status: 'contrast' },
    { date: 'Feb 20, 2026', description: 'Invoice INV-2026-0046 paid', type: 'Payment', amount: 0.00, balance: 645.32, status: 'success' }
  ];

  upcoming = {
    renewalDate: 'Apr 5, 2026',
    renewalDesc: 'AI Automation Pro subscription',
    pendingInvoices: '1 Overdue',
    pendingDesc: 'INV-2026-0047 — 5 days overdue'
  };

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
  }

  getAmountClass(amount: number): string {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  }

  refreshBalance() {
    this.balance$ = this.billingService.getBalance();
  }
}
