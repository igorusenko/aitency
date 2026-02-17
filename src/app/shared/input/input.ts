import {Component, computed, input, InputSignal, signal} from '@angular/core';
import {FloatLabel} from 'primeng/floatlabel';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-input',
  imports: [
    FloatLabel,
    FormsModule,
    InputText,
    Message,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class Input {
  form: InputSignal<FormGroup> = input.required<FormGroup>();
  formSubmitted: InputSignal<boolean> = input.required<boolean>();
  controlName: InputSignal<string> = input.required<string>();
  type: InputSignal<string> = input('text');
  title: InputSignal<string> = input('');

  control = computed<FormControl>(() => {
    return this.form().get(this.controlName()) as FormControl;
  });

  isInvalidControl(): boolean {
    const c = this.control();
    return (c && c.invalid && (c.touched || c.dirty || this.formSubmitted()));
  }

  getErrorMessage(): string {
    const c = this.control();
    if (!c || !c.errors) return '';

    const errors = c.errors;

    if (errors['required']) {
      return `${this.title()} is required`;
    }

    if (errors['email']) {
      return `Invalid email format`;
    }

    if (errors['minlength']) {
      return `Minimum length is ${errors['minlength'].requiredLength}`;
    }

    if (errors['maxlength']) {
      return `Maximum length is ${errors['maxlength'].requiredLength}`;
    }

    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `Maximum value is ${errors['max'].max}`;
    }

    if (errors['pattern']) {
      return `Invalid format`;
    }

    if (errors['passwordMismatch']) {
      return `Passwords don't match`;
    }

    // кастомные валидаторы
    const firstKey = Object.keys(errors)[0];
    return errors[firstKey]?.message || 'Invalid field';
  }
}
