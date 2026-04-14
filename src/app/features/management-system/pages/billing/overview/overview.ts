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
import {UsageService} from '../../../../../core/services/management-system/billing/usage/usage.service';

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
  usageService = inject(UsageService);
  userStore = inject(UserStore);
  dialogService = inject(DialogService);
  balance = this.billingService.balance;
  topUpDialogRef: DynamicDialogRef | null = null;
  dashboardCards: Array<{ title: string; value: string; subtitle: string }> = [];

  constructor() {
    effect(() => {
      if (this.onboardingService.onboardingStatus()) {
        if (this.onboardingService.onboardingStatus()?.step)
        this.refreshBalance();
      }
    });
  }

  ngOnInit() {
    if (this.onboardingService.onboardingStatus()?.step) {
      this.billingService.getProfile().subscribe(client => {})
      this.getRecentTransactions();
      this.usageService.getUsageOverview().subscribe(() => {
        this.dashboardCards = [
          { title: 'Active Subscriptions', value: this.usageService.usageOverview()?.activeSubscriptionsCount.toString() || '', subtitle: this.usageService.usageOverview()?.activeSubscriptionNames.join(', ') || '' },
          { title: 'Outstanding Invoices', value: this.usageService.usageOverview()?.outstandingInvoicesCount.toString() || '', subtitle: '' },
          { title: "This Month's Usage", value: `€${this.usageService.usageOverview()?.thisMonthUsage || 0}`, subtitle: 'API calls and custom work' },
          { title: 'Last Payment', value: this.usageService.usageOverview()?.lastPayment.dateLabel || '', subtitle: `€${this.usageService.usageOverview()?.lastPayment.amount} via ${this.usageService.usageOverview()?.lastPayment.method}` }
        ];
      });
    }
  }

  getRecentTransactions() {
    this.billingService.getRecentTransactions().subscribe(transactions => {
      this.transactions = transactions.items;
    });
  }

  accountBalance = 2450.00;

  transactions: Array<RecentTransaction> = [];

  upcoming = {
    renewalDate: 'Apr 5, 2026',
    renewalDesc: 'AI Automation Pro subscription',
    pendingInvoices: '0 Overdue',
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
