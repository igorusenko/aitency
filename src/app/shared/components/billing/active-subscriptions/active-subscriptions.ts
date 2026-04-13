import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common';
import {Tag} from 'primeng/tag';
import {Button} from 'primeng/button';
import {BillingSubscriptionResponse, BillingSubscriptionStatus} from '../../../../core/interfaces/billing/billing.interface';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-active-subscriptions',
  standalone: true,
  imports: [Tag, Button, DatePipe, CurrencyPipe, NgIf, RouterLink],
  templateUrl: './active-subscriptions.html'
})
export class ActiveSubscriptionsComponent {
  @Input() subscriptions: BillingSubscriptionResponse[] = [];
  @Output() upgrade = new EventEmitter<BillingSubscriptionResponse>();
  @Output() cancel = new EventEmitter<BillingSubscriptionResponse>();

  onUpgrade(sub: BillingSubscriptionResponse) {
    this.upgrade.emit(sub);
  }

  onCancel(sub: BillingSubscriptionResponse) {
    this.cancel.emit(sub);
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
      case BillingSubscriptionStatus.Paused:
        return 'warning';
      default:
        return 'secondary';
    }
  }
}
