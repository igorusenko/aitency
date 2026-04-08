import { Component, inject, OnInit, signal } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextComponent } from '../../input-text/input-text';
import { SelectComponent } from '../../select/select';
import { InputNumberComponent } from '../../input-number/input-number';
import { BillingService } from '../../../core/services/management-system/billing/billing.service';
import { MessageService } from 'primeng/api';
import { UserStore } from '../../../core/stores/user.store';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  BillingPlanResponse,
  CreateBillingPlanRequest,
  UpdateBillingPlanRequest,
  BillingPlanInterval, BillingInvoiceLineType, BillingPaymentMethodType
} from '../../../core/interfaces/billing/billing.interface';
import {Checkbox} from '../../checkbox/checkbox';
import {UsageRateTypes} from '../../../core/interfaces/billing/usage/usage.interface';

@Component({
  selector: 'app-create-edit-plan',
  standalone: true,
  imports: [
    Button,
    ReactiveFormsModule,
    FloatLabel,
    InputTextComponent,
    SelectComponent,
    InputNumberComponent,
    Checkbox,
  ],
  templateUrl: './create-edit-plan.html',
  styleUrl: './create-edit-plan.scss'
})
export class CreateEditPlan implements OnInit {
  fb = inject(FormBuilder);
  billingService = inject(BillingService);
  messageService = inject(MessageService);
  userStore = inject(UserStore);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  plan: BillingPlanResponse | null = this.config.data?.plan || null;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    billingCycle: [BillingPlanInterval.Monthly, Validators.required],
    description: ['', Validators.required],
    usageRates: this.fb.array([]),
    currency: ['EUR', Validators.required],
    isActive: [true, Validators.required],
  });

  formSubmitted = signal(false);

  billingCycleOptions = [
    { label: 'Monthly', value: BillingPlanInterval.Monthly },
    { label: 'Quarterly', value: BillingPlanInterval.Quarterly },
    { label: 'Annual', value: BillingPlanInterval.Annual },
  ];

  usageRatePeriods = [
    { label: 'Daily', value: UsageRateTypes.Daily },
    { label: 'Weekly', value: UsageRateTypes.Weekly },
    { label: 'Monthly', value: UsageRateTypes.Monthly },
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    if (this.plan) {
      this.form.patchValue({
        name: this.plan.name,
        slug: this.plan.slug,
        description: this.plan.description,
        price: this.plan.price,
        currency: this.plan.currency,
        billingCycle: this.plan.billingCycle,
        isActive: this.plan.isActive,
      });
      // Заполняем usageRates из плана, если они есть, иначе добавляем пустую запись
      this.usageRates.clear();
      if (Array.isArray(this.plan.usageRates) && this.plan.usageRates.length > 0) {
        this.plan.usageRates.forEach((rate) => {
          this.usageRates.push(this.createUsageRateGroup({
            metricName: rate.metricName,
            includedUnits: rate.includedUnits,
            ratePerUnit: rate.ratePerUnit,
            // periodType в интерфейсе — строка; приводим к нашему enum при совпадении
            periodType: (rate.periodType as UsageRateTypes) ?? UsageRateTypes.Daily,
          }));
        });
      } else {
        this.addUsageRate();
      }
    } else {
      this.form.reset({
        name: '',
        slug: '',
        description: '',
        price: 0,
        currency: 'EUR',
        billingCycle: BillingPlanInterval.Monthly,
        isActive: true,
      });
      this.addUsageRate();
    }
  }

  save(): void {
    this.formSubmitted.set(true);
    if (this.form.invalid) return;
    if (this.plan) {
      this.updatePlan(this.plan.id);
    } else {
      this.createPlan();
    }
  }

  private createPlan(): void {
    const request: CreateBillingPlanRequest = this.form.value;
    this.billingService.createAdminPlan(request).subscribe({
      next: (newPlan) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plan created successfully' });
        this.ref.close(newPlan);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create plan' });
      }
    });
  }

  private updatePlan(planId: string): void {
    const request: UpdateBillingPlanRequest = this.form.value;
    this.billingService.updateAdminPlan(planId, request).subscribe({
      next: (updatedPlan) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plan updated successfully' });
        this.ref.close(updatedPlan);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update plan' });
      }
    });
  }

  close(): void {
    this.ref.close();
    this.form.reset();
    this.formSubmitted.set(false);
  }

  get usageRates(): FormArray {
    return this.form.get('usageRates') as FormArray;
  }

  getUsageRateForm(index: number): FormGroup {
    return this.usageRates.at(index) as FormGroup;
  }

  addUsageRate(): void {
    this.usageRates.push(this.createUsageRateGroup());
  }

  removeUsageRate(index: number): void {
    if (this.usageRates.length > 1) {
      this.usageRates.removeAt(index);
    }
  }

  private createUsageRateGroup(init?: Partial<{ metricName: string; includedUnits: number; ratePerUnit: number; periodType: UsageRateTypes }>): FormGroup {
    return this.fb.group({
      metricName: [init?.metricName ?? '', Validators.required],
      includedUnits: [init?.includedUnits ?? 0, Validators.required],
      ratePerUnit: [init?.ratePerUnit ?? 0, Validators.required],
      periodType: [init?.periodType ?? UsageRateTypes.Daily, Validators.required],
    });
  }
}
