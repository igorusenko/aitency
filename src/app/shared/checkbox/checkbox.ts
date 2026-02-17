import {Component, computed, input, InputSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-checkbox',
  imports: [
    CheckboxModule,
    Message,
    ReactiveFormsModule
  ],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class Checkbox {
  form: InputSignal<FormGroup> = input.required<FormGroup>();
  formSubmitted: InputSignal<boolean> = input.required<boolean>();
  controlName: InputSignal<string> = input.required<string>();
  title: InputSignal<string> = input('');

  control = computed<FormControl | null>(() => {
    const form = this.form();
    const name = this.controlName();

    if (!form || !name) return null;

    return form.get(name) as FormControl;
  });

  isInvalid(): boolean {
    const c = this.control();
    return !!(c && c.invalid && (c.touched || c.dirty || this.formSubmitted()));
  }

  getErrorMessage(): string {
    const c = this.control();
    if (!c?.errors) return '';

    if (c.errors['required'] || c.errors['requiredTrue']) {
      return `${this.title()} is required`;
    }

    const firstKey = Object.keys(c.errors)[0];
    return c.errors[firstKey]?.message || 'Invalid field';
  }
}
