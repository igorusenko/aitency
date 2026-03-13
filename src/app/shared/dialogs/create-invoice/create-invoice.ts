import {Component, inject, model, ModelSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextComponent} from '../../input-text/input-text';
import {InputNumberComponent} from '../../input-number/input-number';

@Component({
  selector: 'app-create-invoice',
  imports: [
    Button,
    Dialog,
    InputText,
    DatePicker,
    FloatLabel,
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    InputNumberComponent
  ],
  templateUrl: './create-invoice.html',
  styleUrl: './create-invoice.scss',
})
export class CreateInvoice {
  fb = inject(FormBuilder);
  visible: ModelSignal<boolean> = model.required();
  invoiceForm: FormGroup = this.fb.group({
    dueDate: new FormControl(),
    description: new FormControl(),
    amount: new FormControl(),
    note: new FormControl(),
  });
  formSubmitted: boolean = false;
}
