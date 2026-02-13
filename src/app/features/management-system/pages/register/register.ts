import {Component, inject, OnInit} from '@angular/core';
import {ButtonDirective, ButtonLabel} from "primeng/button";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {AuthService} from '../../../../core/services/management-system/auth/auth.service';
import {UserService} from '../../../../core/services/management-system/user/user.service';
import {Router, RouterLink} from '@angular/router';
import {concatMap} from 'rxjs';
import {Checkbox} from 'primeng/checkbox';
import {FloatLabel} from 'primeng/floatlabel';
import {IRegistration} from '../../../../core/interfaces/registration.interface';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-register',
  imports: [
    ButtonDirective,
    ButtonLabel,
    FormsModule,
    InputText,
    Message,
    ReactiveFormsModule,
    RouterLink,
    Checkbox,
    FloatLabel
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit{
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  registerForm: FormGroup;
  formSubmitted: boolean = false;
  registrationCompleted: boolean = false;

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      middleName: new FormControl(''),
      terms: new FormControl(null, Validators.requiredTrue),
    });
  }

  control(controlName: string): any {
    return this.registerForm.get(controlName);
  }

  register(): void {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      const {email, firstName, lastName, middleName, terms} = this.registerForm.value;
      const registrationModel: IRegistration = {
        fullName: {
          firstName,
          lastName,
          middleName
        },
        email,
        termsAcceptedAt: new Date(),
      }
      this.authService.register(registrationModel)
        .subscribe(resp => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Please check your email to complete your registration', life: 2000 });
          this.registrationCompleted = true;
        });
    }
  }

  isInvalidControl(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
