import { CommonModule } from '@angular/common';
import {Component, inject, signal, WritableSignal} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import {UserStore} from '../../../../../core/stores/user.store';
import {CreateSubscription} from '../../../../../shared/dialogs/create-subscription/create-subscription';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, CreateSubscription],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.scss'
})
export class Subscriptions {
  userStore = inject(UserStore);
  visibleCreateSubscription: WritableSignal<boolean> = signal(false);
  subscriptions = [
    {
      name: 'AI Automation Pro',
      price: '€299',
      unit: '/ month',
      billing: 'Billed monthly',
      status: 'Active',
      statusSeverity: 'success' as const,
      details: [
        { label: 'Started:', value: 'Jan 15, 2026' },
        { label: 'Next Renewal:', value: 'Apr 5, 2026' }
      ],
      actions: ['Upgrade', 'Cancel']
    },
    {
      name: 'Usage-Based API',
      price: '€0.02',
      unit: '/ call',
      billing: 'Billed monthly with usage',
      status: 'Active',
      statusSeverity: 'success' as const,
      details: [
        { label: 'Started:', value: 'Feb 1, 2026' },
        { label: 'Current Usage:', value: '45,231 calls' }
      ],
      actions: ['Upgrade Plan', 'Cancel']
    }
  ];
}
