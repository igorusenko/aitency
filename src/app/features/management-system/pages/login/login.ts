import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageModule} from 'primeng/message';
import {InputTextModule} from 'primeng/inputtext';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/services/admin/auth/auth.service';
import {concatMap} from 'rxjs';
import {UserService} from '../../../../core/services/admin/user/user.service';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    MessageModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);
  loginForm: FormGroup;
  formSubmitted: boolean = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  control(controlName: string): any {
    return this.loginForm.get(controlName);
  }

  login(): void {
    const {email, password} = this.loginForm.value;
    this.formSubmitted = true;
    this.authService.login(email, password)
      .pipe(concatMap(x => {
        return this.userService.getCurrentUser()
      }))
      .subscribe(user => {
        this.router.navigate(['/home'])
    });
  }

}
