import {Component, inject, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageModule} from 'primeng/message';
import {InputTextModule} from 'primeng/inputtext';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {concatMap} from 'rxjs';
import {UserService} from '../../../../core/services/user.service';

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
    this.authService.login(email, password)
      .pipe(concatMap(x => {
        return this.userService.getCurrentUser()
      }))
      .subscribe(user => {
        this.router.navigate(['/home'])
    });
  }

}
