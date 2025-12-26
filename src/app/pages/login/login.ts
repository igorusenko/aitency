import {Component, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageModule} from 'primeng/message';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    MessageModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login implements OnInit {

  loginForm: FormGroup

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  control(controlName: string): any {
    return this.loginForm.get(controlName);
  }

}
