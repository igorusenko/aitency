import {Component, effect, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import {BillingService} from '../../../../../core/services/management-system/billing/billing.service';
import {TopUpBalance} from '../../../../../shared/dialogs/top-up-balance/top-up-balance';
import {UserStore} from '../../../../../core/stores/user.store';
import {Tooltip} from 'primeng/tooltip';
import {OnboardingService} from '../../../../../core/services/management-system/onboarding/onboarding.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {RecentTransaction} from '../../../../../core/interfaces/billing/billing.interface';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule, TagModule, Tooltip],
  providers: [DialogService],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class BillingOverview implements OnInit {
  billingService = inject(BillingService);
  onboardingService = inject(OnboardingService);
  userStore = inject(UserStore);
  dialogService = inject(DialogService);
  balance = this.billingService.balance;
  topUpDialogRef: DynamicDialogRef | null = null;

  constructor() {
    effect(() => {
      if (this.onboardingService.onboardingStatus()) {
        if (this.onboardingService.onboardingStatus()?.status !== 'NotStarted')
        this.refreshBalance();
      }
    });
  }

  ngOnInit() {
    this.billingService.getProfile().subscribe(client => {})
    this.getRecentTransactions();
  }

  getRecentTransactions() {
    this.billingService.getRecentTransactions().subscribe(transactions => {
      this.transactions = transactions.items;
    });
  }

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

  transactions: Array<RecentTransaction> = [];

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
    this.billingService.refreshBalance();
  }

  openTopUpDialog() {
    this.topUpDialogRef = this.dialogService.open(TopUpBalance, {
      header: 'Top Up Balance',
      width: '35rem',
      closable: true,
    });
    this.topUpDialogRef?.onClose.subscribe(() => {
      this.refreshBalance();
    });
  }
}
