import {Component, computed, input, InputSignal, output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {SelectChangeEvent, SelectModule} from 'primeng/select';
import {Message} from 'primeng/message';
import {ScrollerOptions} from 'primeng/api';
import {SelectLazyLoadEvent} from 'primeng/select';

@Component({
  selector: 'app-select',
  imports: [
    FloatLabel,
    SelectModule,
    Message,
    ReactiveFormsModule
  ],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class SelectComponent {
  form: InputSignal<FormGroup> = input.required<FormGroup>();
  formSubmitted: InputSignal<boolean | undefined> = input<boolean>();
  loading: InputSignal<boolean> = input<boolean>(false);
  lazy: InputSignal<boolean> = input<boolean>(false);
  virtualScroll: InputSignal<boolean> = input<boolean>(false);
  virtualScrollItemSize: InputSignal<number | undefined> = input<number>();
  virtualScrollOptions: InputSignal<ScrollerOptions | undefined> = input<ScrollerOptions | undefined>();
  controlName: InputSignal<string> = input.required<string>();
  title: InputSignal<string> = input('');
  options: InputSignal<any[]> = input.required();
  optionLabel: InputSignal<string> = input('label');
  optionValue: InputSignal<string | undefined> = input();

  onLazyLoad = output<SelectLazyLoadEvent>();
  onChange = output<SelectChangeEvent>();

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

    if (c.errors['required']) {
      return `${this.title()} is required`;
    }

    const firstKey = Object.keys(c.errors)[0];
    return c.errors[firstKey]?.message || 'Invalid field';
  }
}
