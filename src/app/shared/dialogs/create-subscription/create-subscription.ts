import {Component, inject, model, ModelSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {DatePicker} from 'primeng/datepicker';
import {Dialog} from 'primeng/dialog';
import {FloatLabel} from 'primeng/floatlabel';
import {InputNumberComponent} from '../../input-number/input-number';
import {InputTextComponent} from '../../input-text/input-text';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {SelectComponent} from '../../select/select';

@Component({
  selector: 'app-create-subscription',
  imports: [
    Button,
    DatePicker,
    Dialog,
    FloatLabel,
    InputNumberComponent,
    InputTextComponent,
    ReactiveFormsModule,
    SelectComponent
  ],
  templateUrl: './create-subscription.html',
  styleUrl: './create-subscription.scss',
})
export class CreateSubscription {
  fb = inject(FormBuilder);
  visible: ModelSignal<boolean> = model.required();
  subscriptionForm: FormGroup = this.fb.group({
    planName: new FormControl(),
    price: new FormControl(),
    billingCycle: new FormControl(),
    startDate: new FormControl(),
  });
  formSubmitted: boolean = false;
  billingCycles = [
    { name: 'Monthly' },
    { name: 'Quarterly' },
    { name: 'Annual' },
  ]
}
