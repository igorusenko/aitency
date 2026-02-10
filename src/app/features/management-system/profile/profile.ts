import {Component, inject, OnInit} from '@angular/core';
import {StepperModule} from 'primeng/stepper';
import {Button} from 'primeng/button';
import {TabsModule} from 'primeng/tabs';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Checkbox} from 'primeng/checkbox';
import {Message} from 'primeng/message';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-profile',
  imports: [StepperModule, Button, TabsModule, ReactiveFormsModule, Checkbox, Message, FloatLabel, InputText],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  fb = inject(FormBuilder);
  privateForm: FormGroup;
  companyForm: FormGroup;
  privateFormSubmitted: boolean = false;
  companyFormSubmitted: boolean = false;
  tabs = [
    { title: 'Private person', value: '0', content: 'Tab 1 Content' },
    { title: 'Company', value: '1', content: 'Tab 2 Content' },
  ];

  ngOnInit() {
    this.initPrivateForm();
    this.initCompanyForm();
  }

  initPrivateForm(): void {
    this.privateForm = this.fb.group({
      invoice: new FormControl(false),
      fullName: new FormControl(''),
      address: new FormControl(''),
      city: new FormControl(''),
      country: new FormControl(''),
      postIndex: new FormControl(''),
    })
    this.onPrivateInvoiceChanged();
  }

  initCompanyForm(): void {
    this.companyForm = this.fb.group({
      invoice: new FormControl(false),
      name: new FormControl('', Validators.required),
      website: new FormControl(''),
      tax: new FormControl(''),
      address: new FormControl(''),
    })
    this.onCompanyInvoiceChanged();
  }

  onPrivateInvoiceChanged(): void {
    this.privateForm.get('invoice')?.valueChanges.subscribe(value => {
      const controls = ['fullName', 'address', 'city', 'country', 'postIndex'];

      controls.forEach(name => {
        const control = this.privateForm.get(name);
        if (!control) return;

        if (value) {
          control.addValidators(Validators.required);
        } else {
          control.removeValidators(Validators.required);
        }

        control.updateValueAndValidity();
      });
    });
  }

  onCompanyInvoiceChanged(): void {
    this.companyForm.get('invoice')?.valueChanges.subscribe(value => {
      const control = this.companyForm.get('address')
      if (!control) return;

      if (value) control.addValidators(Validators.required);
      else control.removeValidators(Validators.required);

      control?.updateValueAndValidity();
    });
  }

  isInvalidPrivateControl(controlName: string) {
    const control = this.privateForm.get(controlName);
    return control?.invalid && (control.touched || this.privateFormSubmitted);
  }

  isInvalidCompanyControl(controlName: string) {
    const control = this.companyForm.get(controlName);
    return control?.invalid && (control.touched || this.companyFormSubmitted);
  }

  nextPrivateStep(activateCallback: any): void {
    this.privateFormSubmitted = true;
    console.log(this.privateForm)
    if (this.privateForm.valid) {
      this.companyForm.reset();
      activateCallback(2);
    }
  }
  nextCompanyStep(activateCallback: any): void {
    this.companyFormSubmitted = true;
    console.log(this.companyForm)
    if (this.companyForm.valid) {
      this.privateForm.reset();
      activateCallback(2);
    }
  }
}
