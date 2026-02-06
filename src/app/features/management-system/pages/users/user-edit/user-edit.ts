import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Checkbox} from 'primeng/checkbox';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {UserStore} from '../../../../../core/services/admin/user/user.store';
import {UserService} from '../../../../../core/services/admin/user/user.service';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-user-edit',
  imports: [
    Checkbox,
    ReactiveFormsModule,
    FloatLabel,
    InputText,
    Message,
  ],
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.scss',
})
export class UserEdit implements OnInit, OnDestroy {
  userStore = inject(UserStore);
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  editMode: boolean = Boolean(this.userStore.userById()) ?? false;
  userForm: FormGroup;
  formSubmitted: boolean = false;

  ngOnInit() {
    this.initUserForm();
  }

  initUserForm(): void {
    this.userForm = this.fb.group({
      isActive: new FormControl(this.userStore.userById()?.isActive ?? true, [Validators.required]),
      email: new FormControl(this.userStore.userById()?.email ?? null, [Validators.required, Validators.email]),
      companyName: new FormControl(this.userStore.userById()?.companyName ?? null, [Validators.required]),
      address: new FormControl(this.userStore.userById()?.address ?? null, [Validators.required]),
      contactPerson: new FormControl(this.userStore.userById()?.contactPerson ?? null, [Validators.required]),
      billing: this.fb.group({
        account: new FormControl(this.userStore.userById()?.billing.account ?? null, [Validators.required]),
      })
    })
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.userForm.valid) {
      if (this.editMode) {
        this.userService.updateUser({...this.userForm.value, id: this.userStore.userById().id}).subscribe(resp => this.userChanged())
      }
      else {
        this.userService.createUser(this.userForm.value).subscribe(resp => this.userChanged())
      }
    }
  }

  isInvalidUserControl(controlName: string) {
    const control = this.userForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  isInvalidUserBillingControl(controlName: string) {
    const billing = this.userForm.get('billing') as FormGroup;
    const control = billing.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  userChanged(): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Updated Successfully!', life: 2000 });
    this.userForm.reset();
    this.formSubmitted = false;
    this.router.navigate(['/users'])
  }

  ngOnDestroy() {
    this.userForm.reset();
    this.userStore.userById.set(null)
    this.formSubmitted = false;
  }
}
