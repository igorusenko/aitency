import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import {CurrencyPipe, DatePipe} from '@angular/common';
import { BillingService } from '../../../../../core/services/management-system/billing/billing.service';
import {
  BillingPlanResponse,
  BillingSubscriptionResponse,
  BillingSubscriptionStatus
} from '../../../../../core/interfaces/billing/billing.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateSubscriptionDialog } from '../../../../../shared/dialogs/create-subscription-dialog/create-subscription-dialog';
import { UpgradeSubscriptionDialog } from '../../../../../shared/dialogs/upgrade-subscription-dialog/upgrade-subscription-dialog';
import { CancelSubscriptionDialog } from '../../../../../shared/dialogs/cancel-subscription-dialog/cancel-subscription-dialog';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    PrimeTemplate,
    TableModule,
    Tag,
    Button,
    ReactiveFormsModule,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './subscriptions.html',
  providers: [DialogService],
  styleUrl: './subscriptions.scss'
})
export class Subscriptions implements OnInit {
  messageService = inject(MessageService);
  billingService = inject(BillingService);
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null;

  plans: WritableSignal<BillingPlanResponse[]> = signal([]);
  subscriptions: WritableSignal<BillingSubscriptionResponse[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);
  plansLoading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.loadPlans();
    this.loadSubscriptions();
  }

  loadPlans(): void {
    this.plansLoading.set(true);
    this.billingService.getPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.plansLoading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load plans' });
        this.plansLoading.set(false);
      }
    });
  }

  loadSubscriptions(): void {
    this.loading.set(true);
    this.billingService.getSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions.set(subscriptions);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load subscriptions' });
        this.loading.set(false);
      }
    });
  }

  subscribeToPlan(planId: string): void {
    this.billingService.createSubscription({ planId }).subscribe({
      next: (subscription) => {
        this.onSubscriptionCreated(subscription);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to subscribe to plan' });
      }
    });
  }

  openCreateDialog(): void {
    this.ref = this.dialogService.open(CreateSubscriptionDialog, {
      header: 'Create Subscription',
      width: '35rem',
      baseZIndex: 10000
    });

    this.ref?.onClose.subscribe((subscription: BillingSubscriptionResponse) => {
      if (subscription) {
        this.onSubscriptionCreated(subscription);
      }
    });
  }

  openUpgradeDialog(subscription: BillingSubscriptionResponse): void {
    this.ref = this.dialogService.open(UpgradeSubscriptionDialog, {
      header: 'Upgrade Subscription',
      width: '35rem',
      contentStyle: { 'max-height': '600px', overflow: 'auto' },
      baseZIndex: 10000,
      data: subscription
    });

    this.ref?.onClose.subscribe((subscription: BillingSubscriptionResponse) => {
      if (subscription) {
        this.onSubscriptionUpgraded(subscription);
      }
    });
  }

  openCancelDialog(subscription: BillingSubscriptionResponse): void {
    this.ref = this.dialogService.open(CancelSubscriptionDialog, {
      header: 'Cancel Subscription',
      width: '35rem',
      contentStyle: { 'max-height': '600px', overflow: 'auto' },
      baseZIndex: 10000,
      data: subscription
    });

    this.ref?.onClose.subscribe((subscription: BillingSubscriptionResponse) => {
      if (subscription) {
        this.onSubscriptionCanceled(subscription);
      }
    });
  }

  onSubscriptionCreated(subscription: BillingSubscriptionResponse): void {
    this.subscriptions.update(subs => [...subs, subscription]);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subscription created successfully' });
  }

  onSubscriptionUpgraded(subscription: BillingSubscriptionResponse): void {
    const index = this.subscriptions().findIndex(s => s.id === subscription.id);
    if (index >= 0) {
      this.subscriptions.update(subs => {
        const newSubs = [...subs];
        newSubs[index] = subscription;
        return newSubs;
      });
    }
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subscription upgraded successfully' });
  }

  onSubscriptionCanceled(subscription: BillingSubscriptionResponse): void {
    // const index = this.subscriptions().findIndex(s => s.id === subscription.id);
    // if (index >= 0) {
    //   this.subscriptions.update(subs => {
    //     const newSubs = [...subs];
    //     newSubs[index] = subscription;
    //     return newSubs;
    //   });
    // }
    this.loadSubscriptions();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subscription canceled successfully' });
  }

  getStatusSeverity(status: BillingSubscriptionStatus): any {
    switch (status) {
      case BillingSubscriptionStatus.Active:
        return 'success';
      case BillingSubscriptionStatus.Pending:
        return 'info';
      case BillingSubscriptionStatus.Canceled:
        return 'danger';
      case BillingSubscriptionStatus.Expired:
        return 'warning';
      case BillingSubscriptionStatus.Paused:
        return 'warning';
      default:
        return 'secondary';
    }
  }

  isAlreadySubscribed(planId: string): boolean {
    return this.subscriptions().some(s => s.planId === planId);
  }
}
