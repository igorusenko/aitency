import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { SelectComponent } from '../../select/select';
import { BillingService } from '../../../core/services/management-system/billing/billing.service';
import { MessageService } from 'primeng/api';
import { UserStore } from '../../../core/stores/user.store';
import {
  BillingSubscriptionResponse,
  CreateBillingSubscriptionRequest,
  BillingPlanResponse
} from '../../../core/interfaces/billing/billing.interface';

@Component({
  selector: 'app-create-subscription-dialog',
  standalone: true,
  imports: [
    Dialog,
    Button,
    ReactiveFormsModule,
    SelectComponent,
  ],
  templateUrl: './create-subscription-dialog.html',
  styleUrl: './create-subscription-dialog.scss'
})
export class CreateSubscriptionDialog implements OnInit {
  fb = inject(FormBuilder);
  billingService = inject(BillingService);
  messageService = inject(MessageService);
  userStore = inject(UserStore);

  visible = input.required<boolean>();

  created = output<BillingSubscriptionResponse>();
  visibleChange = output<boolean>();

  form: FormGroup = this.fb.group({
    planId: ['', Validators.required],
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
    const isAdmin = this.userStore.currentUser()?.role === 'Admin';
    const planObservable = isAdmin ? this.billingService.getAdminPlans() : this.billingService.getPlans();

    planObservable.subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.planOptions.set(plans.map(p => ({ label: `${p.name} (${p.price} ${p.currency}/${p.billingCycle})`, value: p.id })));
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
    if (this.form.invalid) return;

    const request: CreateBillingSubscriptionRequest = this.form.value;
    this.billingService.createSubscription(request).subscribe({
      next: (subscription) => {
        this.created.emit(subscription);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Subscription created successfully' });
        this.close();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create subscription' });
      }
    });
  }

  close(): void {
    this.visibleChange.emit(false);
    this.form.reset();
    this.formSubmitted.set(false);
  }
}
