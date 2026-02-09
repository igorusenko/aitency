import {Component, inject, OnInit} from '@angular/core';
import {ButtonDirective, ButtonLabel} from 'primeng/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {AuthService} from '../../../../../core/services/admin/auth/auth.service';
import {UserService} from '../../../../../core/services/admin/user/user.service';
import {Router, RouterLink} from '@angular/router';
import {concatMap} from 'rxjs';
import {FloatLabel} from 'primeng/floatlabel';
import {passwordMatchValidator} from '../../../../../core/validators/password-match.validator';

@Component({
  selector: 'app-create-password',
  imports: [
    ButtonDirective,
    ButtonLabel,
    FormsModule,
    InputText,
    Message,
    ReactiveFormsModule,
    FloatLabel,
  ],
  templateUrl: './create-password.html',
  styleUrl: './create-password.scss',
})
export class CreatePassword implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);
  registerCompleteForm: FormGroup;
  formSubmitted: boolean = false;

  ngOnInit() {
    this.registerCompleteForm = this.fb.group({
      password: new FormControl('', Validators.required),
      passwordRepeat: new FormControl('', Validators.required),
    }, { validators: passwordMatchValidator });
  }

  control(controlName: string): any {
    return this.registerCompleteForm.get(controlName);
  }

  login(): void {
    const {email, password} = this.registerCompleteForm.value;
    console.log(this.registerCompleteForm)
    this.formSubmitted = true;
    // this.authService.login(email, password)
    //   .pipe(concatMap(x => {
    //     return this.userService.getCurrentUser()
    //   }))
    //   .subscribe(user => {
    //     this.router.navigate(['/home'])
    //   });
  }

  isInvalidControl(controlName: string) {
    const control = this.registerCompleteForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  hasMissmatchPasswordError() {
    return (
      this.registerCompleteForm.get('passwordRepeat')?.hasError('passwordMismatch') &&
      this.registerCompleteForm.get('passwordRepeat')?.touched
    );
  }

}
