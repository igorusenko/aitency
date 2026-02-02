import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageModule} from 'primeng/message';
import {InputTextModule} from 'primeng/inputtext';
import {Router} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {CsrfService} from '../../core/services/csrf.service';
import {CsrfStore} from '../../core/services/csrf.store';
import {UserService} from '../../core/services/user.service';
import {concatMap, from, tap} from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    MessageModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  csrfService = inject(CsrfService);
  csrfStore = inject(CsrfStore);
  router = inject(Router);
  loginForm: FormGroup

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  control(controlName: string): any {
    return this.loginForm.get(controlName);
  }

  login(): void {
    const {email, password} = this.loginForm.value;
    this.authService.login(email, password).pipe(
      concatMap(() => this.userService.getCurrentUser()),
      concatMap(() => from(this.csrfService.loadCsrfToken())),
      tap(() => {
        const t = this.csrfService.token;
        if (t) this.csrfStore.csrfToken.set(t);
      })
    ).subscribe(() => this.router.navigate(['/home']));
  }
}
