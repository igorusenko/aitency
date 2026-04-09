import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { SelectComponent } from '../../select/select';
import { BillingService } from '../../../core/services/management-system/billing/billing.service';
import { MessageService } from 'primeng/api';
import { UserStore } from '../../../core/stores/user.store';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  BillingSubscriptionResponse,
  UpgradeBillingSubscriptionRequest,
  BillingPlanResponse
} from '../../../core/interfaces/billing/billing.interface';

@Component({
  selector: 'app-upgrade-subscription-dialog',
  standalone: true,
  imports: [
    Button,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './upgrade-subscription-dialog.html',
  styleUrl: './upgrade-subscription-dialog.scss'
})
export class UpgradeSubscriptionDialog implements OnInit {
  fb = inject(FormBuilder);
  billingService = inject(BillingService);
  messageService = inject(MessageService);
  userStore = inject(UserStore);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  subscription: BillingSubscriptionResponse | null = this.config.data || null;

  form: FormGroup = this.fb.group({
    newPlanId: ['', Validators.required],
  });

  formSubmitted = signal(false);
  plans = signal<BillingPlanResponse[]>([]);
  plansLoading = signal(false);
  planOptions = signal<any[]>([]);

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.plansLoading.set(true);
    const isAdmin = this.userStore.userRole === 'Admin';
    const planObservable = isAdmin ? this.billingService.getAdminPlans() : this.billingService.getPlans();

    planObservable.subscribe({
      next: (plans) => {
        this.plans.set(plans);
        const currentPlanId = this.subscription?.planId;
        this.planOptions.set(
          plans
            .filter(p => p.id !== currentPlanId)
            .map(p => ({ label: `${p.name} (${p.price} ${p.currency}/${p.billingCycle})`, value: p.id }))
        );
        this.plansLoading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load plans' });
        this.plansLoading.set(false);
      }
    });
  }

  save(): void {
    this.formSubmitted.set(true);
    if (this.form.invalid || !this.subscription) return;

    const request: UpgradeBillingSubscriptionRequest = this.form.value;
    this.billingService.upgradeSubscription(this.subscription.id, request).subscribe({
      next: (subscription) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subscription upgraded successfully' });
        this.ref.close(subscription);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upgrade subscription' });
      }
    });
  }

  close(): void {
    this.ref.close();
    this.form.reset();
    this.formSubmitted.set(false);
  }
}
