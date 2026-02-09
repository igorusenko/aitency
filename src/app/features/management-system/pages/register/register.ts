import {Component, inject, OnInit} from '@angular/core';
import {ButtonDirective, ButtonLabel} from "primeng/button";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {AuthService} from '../../../../core/services/admin/auth/auth.service';
import {UserService} from '../../../../core/services/admin/user/user.service';
import {Router, RouterLink} from '@angular/router';
import {concatMap} from 'rxjs';
import {Checkbox} from 'primeng/checkbox';
import {FloatLabel} from 'primeng/floatlabel';

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
  registerForm: FormGroup;
  formSubmitted: boolean = false;

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      fullName: new FormControl('', [Validators.required]),
      terms: new FormControl(null, Validators.requiredTrue),
    });
  }

  control(controlName: string): any {
    return this.registerForm.get(controlName);
  }

  register(): void {
    this.formSubmitted = true;
    const {email, password} = this.registerForm.value;
    // this.authService.login(email, password)
    //   .pipe(concatMap(x => {
    //     return this.userService.getCurrentUser()
    //   }))
    //   .subscribe(user => {
    //     this.router.navigate(['/home'])
    //   });
  }

  isInvalidControl(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }
}
