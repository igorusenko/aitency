import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { UserStore } from '../../../../../core/stores/user.store';
import { BillingService } from '../../../../../core/services/management-system/billing/billing.service';
import {
  BillingPlanResponse
} from '../../../../../core/interfaces/billing/billing.interface';
import { CreateEditPlan } from '../../../../../shared/dialogs/create-edit-plan/create-edit-plan';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [
    PrimeTemplate,
    TableModule,
    Button,
    ReactiveFormsModule,
    CreateEditPlan
  ],
  providers: [DialogService],
  templateUrl: './plans.html',
  styleUrl: './plans.scss'
})
export class Plans implements OnInit {
  userStore = inject(UserStore);
  messageService = inject(MessageService);
  billingService = inject(BillingService);
  dialogService = inject(DialogService);

  plans: WritableSignal<BillingPlanResponse[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);
  dialogRef: DynamicDialogRef | null = null;

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading.set(true);
    const isAdmin = this.userStore.userRole === 'Admin';
    const plansObservable = isAdmin ? this.billingService.getAdminPlans() : this.billingService.getPlans();

    plansObservable.subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load plans' });
        this.loading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    this.dialogRef = this.dialogService.open(CreateEditPlan, {
      header: 'Create Plan',
      width: '35rem'
    });
    this.dialogRef?.onClose.subscribe((savedPlan: BillingPlanResponse) => {
      if (savedPlan) {
        this.plans.update(plans => [...plans, savedPlan]);
      }
    });
  }

  openEditDialog(plan: BillingPlanResponse): void {
    this.dialogRef = this.dialogService.open(CreateEditPlan, {
      header: 'Edit Plan',
      width: '35rem',
      data: { plan }
    });
    this.dialogRef?.onClose.subscribe((savedPlan: BillingPlanResponse) => {
      if (savedPlan) {
        const existingIndex = this.plans().findIndex(p => p.id === savedPlan.id);
        if (existingIndex >= 0) {
          this.plans.update(plans => {
            const newPlans = [...plans];
            newPlans[existingIndex] = savedPlan;
            return newPlans;
          });
        }
      }
    });
  }

  deletePlan(plan: BillingPlanResponse): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.billingService.deleteAdminPlan(plan.id).subscribe({
        next: () => {
          this.plans.update(plans => plans.filter(p => p.id !== plan.id));
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plan deleted successfully' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete plan' });
        }
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(value);
  }
}
