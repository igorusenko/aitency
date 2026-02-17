import {Component, inject, OnInit} from '@angular/core';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {AuthService} from '../../../../../core/services/management-system/auth/auth.service';
import {UserService} from '../../../../../core/services/management-system/user/user.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {concatMap} from 'rxjs';
import {FloatLabel} from 'primeng/floatlabel';
import {passwordMatchValidator} from '../../../../../core/validators/password-match.validator';
import {ISetPassword} from '../../../../../core/interfaces/registration.interface';
import {MessageService} from 'primeng/api';
import {Input} from '../../../../../shared/input/input';

@Component({
  selector: 'app-create-password',
  imports: [
    ButtonDirective,
    ButtonLabel,
    FormsModule,
    ReactiveFormsModule,
    Input,
  ],
  templateUrl: './create-password.html',
  styleUrl: './create-password.scss',
})
export class CreatePassword implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  registerCompleteForm: FormGroup;
  formSubmitted: boolean = false;

  ngOnInit() {
    this.registerCompleteForm = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(10)]),
      confirmPassword: new FormControl('', Validators.required),
    }, { validators: passwordMatchValidator });
  }

  setPassword(): void {
    this.formSubmitted = true;
    const { password, confirmPassword } = this.registerCompleteForm.value;
    const token = this.route.snapshot.queryParams['token'];
    if (token && this.registerCompleteForm.valid) {
      const setPasswordModel: ISetPassword = {
        token,
        password,
        confirmPassword
      }
      if (this.route.snapshot.routeConfig?.path === 'reset-password') {
        this.authService.resetPassword(setPasswordModel)
          .subscribe(x => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password has been successfully updated!', life: 2000 });
            this.router.navigate(['/login']);
          })
      }
      else {
        this.authService.setPassword(setPasswordModel)
          .pipe(concatMap(x => this.userService.getCurrentUser()))
          .subscribe(x => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration completed!', life: 2000 });
            this.router.navigate(['/onboarding']);
          })
      }
    }
  }

}
