import {Component, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {UserStore} from '../../../../core/stores/user.store';
import {AnalyticsService} from '../../../../core/services/management-system/analytics/analytics.service';
import {SelectComponent} from '../../../../shared/select/select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../core/services/management-system/user/user.service';
import {IUser} from '../../../../core/interfaces/users/user';
import {ScrollerOptions} from 'primeng/api';
import {SelectChangeEvent, SelectLazyLoadEvent} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {CurrencyPipe, DatePipe, NgClass, UpperCasePipe} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Button} from 'primeng/button';
import {TableModule, TableRowSelectEvent} from 'primeng/table';
import {AutomationAdminService} from '../../../../core/services/management-system/automation/automation-admin.service';
import {AutomationsStore} from '../../../../core/stores/automations.store';
import {Router, RouterLink} from '@angular/router';
import {Tooltip} from 'primeng/tooltip';
import {BillingService} from '../../../../core/services/management-system/billing/billing.service';
import {OnboardingService} from '../../../../core/services/management-system/onboarding/onboarding.service';
import {Tag} from 'primeng/tag';
import {BillingInvoiceListItemResponse, BillingSubscriptionResponse, RecentTransaction} from '../../../../core/interfaces/billing/billing.interface';
import {ActiveSubscriptionsComponent} from '../../../../shared/components/billing/active-subscriptions/active-subscriptions';

@Component({
  selector: 'app-home',
  imports: [
    SelectComponent,
    ReactiveFormsModule,
    DatePicker,
    FloatLabel,
    DatePipe,
    Button,
    TableModule,
    UpperCasePipe,
    NgClass,
    RouterLink,
    CurrencyPipe,
    Tooltip,
    Tag,
    ActiveSubscriptionsComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  userStore = inject(UserStore);
  analyticsService = inject(AnalyticsService);
  userService = inject(UserService);
  fb = inject(FormBuilder);
  automationAdminService = inject(AutomationAdminService);
  automationsStore = inject(AutomationsStore);
  billingService = inject(BillingService);
  onboardingService = inject(OnboardingService);
  router = inject(Router);
  balance = this.billingService.balance;
  invoices: WritableSignal<BillingInvoiceListItemResponse[]> = signal([]);
  subscriptions: WritableSignal<BillingSubscriptionResponse[]> = signal([]);
  analyticsForm: FormGroup;
  formSubmitted: boolean = false;
  usersLoading: boolean = false;
  analyticsLoading: boolean = false;
  users: Array<IUser> = [];
  userId: any;
  from: any;
  to: any;
  page: number = 1;
  count: number = 10;
  totalRecords: number = 0;
  options: ScrollerOptions = {
    delay: 250,
  };

  automationsLoading: boolean = false;
  invoicesLoading: boolean = false;
  transactions: Array<RecentTransaction> = [];

  constructor() {
    effect(() => {
      if (this.onboardingService.onboardingStatus()) {
        if (this.onboardingService.onboardingStatus()?.status !== 'NotStarted' && this.userStore.userRole !== 'Admin')
          this.billingService.refreshBalance();
      }
    });
  }

  ngOnInit() {
    this.userId = this.userStore.currentUser().id
    this.initAnalyticsForm();
    this.loadInitialData();
    this.getAutomations();
    if (this.userStore.userRole !== 'Demo' && this.userStore.onboarding()?.step) {
      this.getInvoices();
      if (this.userStore.userRole === 'Default') {
        this.getRecentTransactions();
        this.getSubscriptions();
      }
    }
  }

  getAutomations(): void {
    this.automationsLoading = true;
    this.automationAdminService.getAutomations(1, 3).subscribe({
      next: (x) => {
        this.totalRecords = x.totalCount;
        this.automationsLoading = false;
      },
      error: (error) => {
        console.error('Error loading automations:', error);
        this.automationsLoading = false;
      }
    })
  }

  getInvoices(): void {
    this.invoicesLoading = true;
    const role = this.userStore.userRole;

    const request$ = role === 'Admin'
      ? this.billingService.getAdminInvoices({page: 1, count: 3})
      : this.billingService.getInvoices({page: 1, count: 3});

    request$.subscribe({
      next: (response) => {
        this.invoices.set(response.items);
        this.invoicesLoading = false;
      },
      error: () => {
        this.invoicesLoading = false;
      }
    });
  }

  getSubscriptions(): void {
    this.billingService.getSubscriptions().subscribe({
      next: (subs) => this.subscriptions.set(subs),
      error: () => {}
    });
  }

  getRecentTransactions() {
    this.billingService.getRecentTransactions().subscribe(transactions => {
      this.transactions = transactions.items;
    });
  }

  loadInitialData(): void {
    if (this.userStore.userRole === 'Admin') {
      this.userId = null;
      this.getUsers();
      this.getAnalytics();
    }
  }

  initAnalyticsForm(): void {
    this.analyticsForm = this.fb.group({
      userId: [null],
      dateRange: [null],
    });
  }

  getUsers(): void {
    if (this.usersLoading) return;
    this.usersLoading = true;
    this.userService.getUsers(this.page, this.count).subscribe(res => {
      this.users = [{fullName: 'All', id: null}, ...res.items];
      this.totalRecords = res.total;
      this.usersLoading = false;
    })
  }

  getAnalytics(): void {
    this.analyticsLoading = true;
    this.analyticsService.getAnalyticsByUserId(this.userId, this.from, this.to).subscribe({
      next: (res) => {
        // Обработка данных аналитики
        this.analyticsLoading = false;
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.analyticsLoading = false;
      }
    })
  }

  onDateChange(): void {
    this.analyticsForm.get('dateRange')?.valueChanges.subscribe(dateRange => {
      if (dateRange && dateRange[0] && dateRange[1]) {
        const from = new Date(dateRange[0]);
        from.setHours(23, 59, 59, 999);
        const to = new Date(dateRange[1]);
        to.setHours(23, 59, 59, 999);

        this.from = this.formatDate(from);
        this.to = this.formatDate(to);
      }
      else {
        this.from = null;
        this.to = null;
      }
      this.getAnalytics();
    })
  }

  formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  onLazyLoadUsers(event: SelectLazyLoadEvent): void {
    const { first, last } = event;

    if (last >= this.users.length && this.users.length < this.totalRecords) {
      this.page++;
      this.getUsers();
    }
  }

  onChangeUser(event: SelectChangeEvent): void {
    this.userId = event.value;
    this.getAnalytics();
  }

  getAmountClass(amount: number): string {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  }

  formatCurrency(value: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(value);
  }

  getInvoiceStatusSeverity(status: string): any {
    switch (status) {
      case 'Cancelled': return 'danger';
      case 'Draft': return 'secondary';
      case 'Overdue': return 'warn';
      case 'Issued': return 'info';
      case 'Paid': return 'primary';
    }
  }

  selectRow(row: TableRowSelectEvent) {
    this.automationsStore.automation.set(row.data);
    this.router.navigate(['/automations', row.data.id]);
  }
}
