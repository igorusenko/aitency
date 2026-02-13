import {Component, inject, OnInit} from '@angular/core';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {Checkbox} from 'primeng/checkbox';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/management-system/auth/auth.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ButtonDirective,
    ButtonLabel,
    FloatLabel,
    InputText,
    Message,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  forgotPasswordForm: FormGroup;
  formSubmitted: boolean = false;

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  isInvalidControl(controlName: string) {
    const control = this.forgotPasswordForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  forgotPassword(): void {
    this.formSubmitted = true;
    if (this.forgotPasswordForm.valid)
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(() => {

      })
  }
}
