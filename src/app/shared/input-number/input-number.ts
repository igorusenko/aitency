import {Component, computed, input, InputSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {Message} from 'primeng/message';
import {InputNumber} from 'primeng/inputnumber';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    Message,
    InputNumber
  ],
  templateUrl: './input-number.html',
  styleUrl: './input-number.scss',
})
export class InputNumberComponent {
  form: InputSignal<FormGroup> = input.required<FormGroup>();
  formSubmitted: InputSignal<boolean> = input.required<boolean>();
  controlName: InputSignal<string> = input.required<string>();

  label: InputSignal<string> = input('');

  min: InputSignal<number | undefined> = input();
  max: InputSignal<number | undefined> = input();

  minFractionDigits: InputSignal<number> = input(0);
  maxFractionDigits: InputSignal<number> = input(2);

  mode: InputSignal<'decimal' | 'currency'> = input<'decimal' | 'currency'>('decimal');

  control = computed<FormControl | null>(() => {
    const form = this.form();
    const name = this.controlName();

    if (!form || !name) return null;
    return form.get(name) as FormControl;
  });

  isInvalid(): boolean {
    const c = this.control();
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  getErrorMessage(): string {
    const c = this.control();
    if (!c?.errors) return '';

    if (c.errors['required']) {
      return `${this.label()} is required`;
    }

    if (c.errors['min']) {
      return `Minimum value is ${c.errors['min'].min}`;
    }

    if (c.errors['max']) {
      return `Maximum value is ${c.errors['max'].max}`;
    }

    const firstKey = Object.keys(c.errors)[0];
    return c.errors[firstKey]?.message || 'Invalid value';
  }
}
