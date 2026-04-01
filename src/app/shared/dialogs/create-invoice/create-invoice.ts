import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputNumberComponent} from '../../input-number/input-number';
import { SelectComponent } from '../../select/select';
import { BillingService } from '../../../core/services/management-system/billing/billing.service';
import { BillingInvoiceLineType, CreateManualBillingInvoiceRequest } from '../../../core/interfaces/billing/billing.interface';
import { UserService } from '../../../core/services/management-system/user/user.service';
import { UserWithClientResponse } from '../../../core/interfaces/users/user-with-client.interface';
import { CommonModule } from '@angular/common';

import {UserStore} from '../../../core/stores/user.store';
import {SelectFilterEvent} from 'primeng/select';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {InputTextComponent} from '../../input-text/input-text';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-invoice',
  imports: [
    Button,
    DatePicker,
    FloatLabel,
    FormsModule,
    ReactiveFormsModule,
    InputNumberComponent,
    SelectComponent,
    CommonModule,
    InputTextComponent
  ],
  templateUrl: './create-invoice.html',
  styleUrl: './create-invoice.scss',
})
export class CreateInvoice implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  billingService = inject(BillingService);
  userService = inject(UserService);
  userStore = inject(UserStore);
  ref = inject(DynamicDialogRef);

  private filterSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  clientOptions: WritableSignal<Array<{ label: string; value: string }>> = signal([]);
  lineTypeOptions = [
    { label: 'Subscription', value: BillingInvoiceLineType.Subscription },
    { label: 'Usage', value: BillingInvoiceLineType.Usage },
    { label: 'Proration', value: BillingInvoiceLineType.Proration },
    { label: 'Adjustment', value: BillingInvoiceLineType.Adjustment },
    { label: 'Manual', value: BillingInvoiceLineType.Manual },
  ];

  invoiceForm: FormGroup = this.fb.group({
    clientId: new FormControl<string | null>(null, { validators: [Validators.required] }),
    dueDate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    invoiceNumber: new FormControl<string>('', { validators: [Validators.required] }),
    discountAmount: new FormControl<number>(0, { validators: [Validators.min(0)] }),
    taxAmount: new FormControl<number>(0, { validators: [Validators.min(0)] }),
    lines: this.fb.array([]),
    note: new FormControl<string>(''),
  });
  formSubmitted: boolean = false;

  get lines(): FormArray {
    return this.invoiceForm.get('lines') as FormArray;
  }

  ngOnInit(): void {
    // Добавляем хотя бы одну строку по умолчанию
    this.addLine();

    // Предзагрузка только для администратора
    if (this.userStore.currentUser()?.role === 'Admin') {
      this.loadUsersForSelect();
    }

    this.filterSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(filter => this.loadUsersForSelect(filter));
  }

  addLine(): void {
    const lineGroup = this.fb.group({
      lineType: new FormControl<BillingInvoiceLineType>(BillingInvoiceLineType.Subscription, { validators: [Validators.required] }),
      description: new FormControl<string>('', { validators: [Validators.required] }),
      quantity: new FormControl<number>(1, { validators: [Validators.required, Validators.min(1)] }),
      unitPrice: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0.01)] }),
    });
    this.lines.push(lineGroup);
  }

  removeLine(index: number): void {
    if (this.lines.length > 1) {
      this.lines.removeAt(index);
    }
  }

  loadUsersForSelect(emailFilter: string = ''): void {
    this.userService.getUsersWithClient(emailFilter, 1, 20).subscribe((res) => {
      const options = res.items.map((u: UserWithClientResponse) => ({ label: `${u.email}`, value: u.clientId }));
      this.clientOptions.set(options);
    });
  }

  createAdminInvoice(): void {
    this.formSubmitted = true;
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const v = this.invoiceForm.getRawValue();

    const request: CreateManualBillingInvoiceRequest = {
      clientId: v.clientId,
      dueDate: (v.dueDate as Date).toISOString(),
      discountAmount: Number(v.discountAmount || 0),
      taxAmount: Number(v.taxAmount || 0),
      notes: v.note || null,
      lines: v.lines.map((l: any) => ({
        lineType: l.lineType,
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice
      })),
      invoiceNumber: v.invoiceNumber
    };

    this.billingService.createAdminInvoice(request).subscribe({
      next: () => {
        this.ref.close(true);
        // Сброс формы для следующего раза
        this.resetForm();
      },
      error: () => {
        // оставить форму открытой для исправления
      }
    });
  }

  private resetForm(): void {
    this.formSubmitted = false;
    this.invoiceForm.reset({
      discountAmount: 0,
      taxAmount: 0
    });
    while (this.lines.length) {
      this.lines.removeAt(0);
    }
    this.addLine();
  }

  getControl(control: string): FormControl {
    return this.invoiceForm.get(control) as FormControl;
  }

  getLineForm(index: number): FormGroup {
    return this.lines.at(index) as FormGroup;
  }

  onFilter(event: SelectFilterEvent): void {
    this.filterSubject.next(event.filter);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
