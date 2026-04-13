import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {Tag} from 'primeng/tag';
import {Button} from 'primeng/button';
import {BillingPlanResponse} from '../../../../core/interfaces/billing/billing.interface';

@Component({
  selector: 'app-plans-list',
  standalone: true,
  imports: [Tag, Button, CurrencyPipe],
  templateUrl: './plans-list.html'
})
export class PlansListComponent {
  @Input() plans: BillingPlanResponse[] = [];
  @Input() isAlreadySubscribed?: (planId: string) => boolean;
  @Output() subscribe = new EventEmitter<string>();

  onSubscribe(planId: string) {
    this.subscribe.emit(planId);
  }
}
