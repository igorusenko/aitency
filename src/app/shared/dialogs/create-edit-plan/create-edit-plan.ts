import { Component, inject, input, output, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Textarea } from 'primeng/textarea';
import { InputTextComponent } from '../../input-text/input-text';
import { SelectComponent } from '../../select/select';
import { InputNumberComponent } from '../../input-number/input-number';
import { BillingService } from '../../../core/services/management-system/billing/billing.service';
import { MessageService } from 'primeng/api';
import {
  BillingPlanResponse,
  CreateBillingPlanRequest,
  UpdateBillingPlanRequest,
  BillingPlanInterval
} from '../../../core/interfaces/billing/billing.interface';
import {Checkbox} from '../../checkbox/checkbox';

@Component({
  selector: 'app-create-edit-plan',
  standalone: true,
  imports: [
    Dialog,
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
export class CreateEditPlan implements OnInit, OnChanges {
  fb = inject(FormBuilder);
  billingService = inject(BillingService);
  messageService = inject(MessageService);

  visible = input.required<boolean>();
  plan = input<BillingPlanResponse | null>();

  saved = output<BillingPlanResponse>();
  visibleChange = output<boolean>();

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    currency: ['USD', Validators.required],
    interval: [BillingPlanInterval.Monthly, Validators.required],
    features: [[]],
    isActive: [true]
  });

  formSubmitted = signal(false);

  intervalOptions = [
    { label: 'Daily', value: BillingPlanInterval.Daily },
    { label: 'Weekly', value: BillingPlanInterval.Weekly },
    { label: 'Monthly', value: BillingPlanInterval.Monthly },
    { label: 'Yearly', value: BillingPlanInterval.Yearly }
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plan']) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    const plan = this.plan();
    if (plan) {
      this.form.patchValue({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        interval: plan.interval,
        isActive: plan.isActive
      });
    } else {
      this.form.reset({
        name: '',
        description: '',
        price: 0,
        currency: 'EUR',
        interval: BillingPlanInterval.Monthly,
        isActive: true
      });
    }
  }

  save(): void {
    this.formSubmitted.set(true);
    if (this.form.invalid) return;

    const plan = this.plan();
    if (plan) {
      this.updatePlan(plan.id);
    } else {
      this.createPlan();
    }
  }

  private createPlan(): void {
    const request: CreateBillingPlanRequest = this.form.value;
    console.log(request)
    // this.billingService.createAdminPlan(request).subscribe({
    //   next: (newPlan) => {
    //     this.saved.emit(newPlan);
    //     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plan created successfully' });
    //   },
    //   error: (error) => {
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create plan' });
    //   }
    // });
  }

  private updatePlan(planId: string): void {
    const request: UpdateBillingPlanRequest = this.form.value;
    this.billingService.updateAdminPlan(planId, request).subscribe({
      next: (updatedPlan) => {
        this.saved.emit(updatedPlan);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Plan updated successfully' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update plan' });
      }
    });
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }
}
