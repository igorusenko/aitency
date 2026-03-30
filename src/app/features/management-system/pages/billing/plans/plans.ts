import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { UserStore } from '../../../../../core/stores/user.store';
import { BillingService } from '../../../../../core/services/management-system/billing/billing.service';
import {
  BillingPlanResponse
} from '../../../../../core/interfaces/billing/billing.interface';
import { CreateEditPlan } from '../../../../../shared/dialogs/create-edit-plan/create-edit-plan';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    PrimeTemplate,
    TableModule,
    Tag,
    Button,
    ReactiveFormsModule,
    CurrencyPipe,
    CreateEditPlan
  ],
  templateUrl: './plans.html',
  styleUrl: './plans.scss'
})
export class Plans implements OnInit {
  userStore = inject(UserStore);
  messageService = inject(MessageService);
  billingService = inject(BillingService);

  plans: WritableSignal<BillingPlanResponse[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);

  planDialogVisible: WritableSignal<boolean> = signal(false);
  planToEdit: WritableSignal<BillingPlanResponse | null> = signal(null);

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading.set(true);
    this.billingService.getAdminPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load plans' });
        this.loading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    this.planToEdit.set(null);
    this.planDialogVisible.set(true);
  }

  openEditDialog(plan: BillingPlanResponse): void {
    this.planToEdit.set(plan);
    this.planDialogVisible.set(true);
  }

  onPlanSaved(savedPlan: BillingPlanResponse): void {
    const existingIndex = this.plans().findIndex(p => p.id === savedPlan.id);
    if (existingIndex >= 0) {
      // Update
      this.plans.update(plans => {
        const newPlans = [...plans];
        newPlans[existingIndex] = savedPlan;
        return newPlans;
      });
    } else {
      // Create
      this.plans.update(plans => [...plans, savedPlan]);
    }
    this.planDialogVisible.set(false);
    this.planToEdit.set(null);
  }

  deletePlan(plan: BillingPlanResponse): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.billingService.deleteAdminPlan(plan.id).subscribe({
        next: () => {
          this.plans.update(plans => plans.filter(p => p.id !== plan.id));
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plan deleted successfully' });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete plan' });
        }
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
  }
}
