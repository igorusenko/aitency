import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import {CurrencyPipe, DatePipe} from '@angular/common';
import { BillingService } from '../../../../../core/services/management-system/billing/billing.service';
import {
  BillingSubscriptionResponse,
  BillingSubscriptionStatus
} from '../../../../../core/interfaces/billing/billing.interface';
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
    CreateSubscriptionDialog,
    UpgradeSubscriptionDialog,
    CancelSubscriptionDialog,
    CurrencyPipe
  ],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.scss'
})
export class Subscriptions implements OnInit {
  messageService = inject(MessageService);
  billingService = inject(BillingService);

  subscriptions: WritableSignal<BillingSubscriptionResponse[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  createDialogVisible: WritableSignal<boolean> = signal(false);
  upgradeDialogVisible: WritableSignal<boolean> = signal(false);
  subscriptionToUpgrade: WritableSignal<BillingSubscriptionResponse | null> = signal(null);

  cancelDialogVisible: WritableSignal<boolean> = signal(false);
  subscriptionToCancel: WritableSignal<BillingSubscriptionResponse | null> = signal(null);

  ngOnInit(): void {
    this.loadSubscriptions();
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

  openCreateDialog(): void {
    this.createDialogVisible.set(true);
  }

  openUpgradeDialog(subscription: BillingSubscriptionResponse): void {
    this.subscriptionToUpgrade.set(subscription);
    this.upgradeDialogVisible.set(true);
  }

  openCancelDialog(subscription: BillingSubscriptionResponse): void {
    this.subscriptionToCancel.set(subscription);
    this.cancelDialogVisible.set(true);
  }

  onSubscriptionCreated(subscription: BillingSubscriptionResponse): void {
    this.subscriptions.update(subs => [...subs, subscription]);
    this.createDialogVisible.set(false);
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
    this.upgradeDialogVisible.set(false);
    this.subscriptionToUpgrade.set(null);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subscription upgraded successfully' });
  }

  onSubscriptionCanceled(subscription: BillingSubscriptionResponse): void {
    const index = this.subscriptions().findIndex(s => s.id === subscription.id);
    if (index >= 0) {
      this.subscriptions.update(subs => {
        const newSubs = [...subs];
        newSubs[index] = subscription;
        return newSubs;
      });
    }
    this.cancelDialogVisible.set(false);
    this.subscriptionToCancel.set(null);
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
}
