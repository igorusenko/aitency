import {Component, inject, OnDestroy, OnInit, Signal} from '@angular/core';
import {Checkbox} from "primeng/checkbox";
import {FloatLabel} from "primeng/floatlabel";
import {InputNumber} from "primeng/inputnumber";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from "primeng/select";
import {AutomationAdminService} from '../../../../../core/services/admin/automation/automation-admin.service';
import {AssistantService} from '../../../../../core/services/voice-assistant/assistant.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {toSignal} from '@angular/core/rxjs-interop';
import {concatMap, map, Observable, of} from 'rxjs';
import {IAutomation} from '../../../../../core/interfaces/automations/automation-interface';
import {AutomationsStore} from '../../../../../core/stores/automations.store';
import {MultiSelect} from 'primeng/multiselect';
import {UserStore} from '../../../../../core/services/admin/user/user.store';
import {IAppendUserModel} from '../../../../../core/interfaces/users/user';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-automation-edit',
  imports: [
    Checkbox,
    FloatLabel,
    InputNumber,
    InputText,
    Message,
    ReactiveFormsModule,
    Select,
    FormsModule,
    Button,
    DatePipe,
    TableModule
  ],
  templateUrl: './automation-edit.html',
  styleUrl: './automation-edit.scss',
})
export class AutomationEdit implements OnInit, OnDestroy {
  automationAdminService = inject(AutomationAdminService)
  automationStore = inject(AutomationsStore);
  userStore = inject(UserStore);
  router = inject(Router);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  usersMappedToAppend: IAppendUserModel;
  editMode: boolean = Boolean(this.automationStore.automation()) ?? false;
  linkedUsers = [];

  voices = [
    { name: 'alloy' },
    { name: 'echo' },
    { name: 'shimmer' },
    { name: 'marin' },
    { name: 'cedar' }
  ];
  automationForm: FormGroup;
  formSubmitted: boolean = false;

  ngOnInit() {
    this.initAutomationForm();
    this.usersMappedToAppend = {
      automationId: this.automationStore.automation()?.id!,
      userIds: this.userStore.users().items.map((user: any) => user.id)
    }
  }

  initAutomationForm(): void {
    this.automationForm = this.fb.group({
      isActive: new FormControl(this.automationStore.automation()?.isActive ?? true, [Validators.required]),
      isDemo: new FormControl(this.automationStore.automation()?.isDemo ?? true, [Validators.required]),
      serverId: new FormControl(this.automationStore.automation()?.serverId ?? '', [Validators.required]),
      config: this.fb.group({
        voice: new FormControl(this.automationStore.automation()?.config?.voice ?? null, [Validators.required]),
        volume: new FormControl(this.automationStore.automation()?.config?.volume ?? null, [Validators.required]),
        speed: new FormControl(this.automationStore.automation()?.config?.speed ?? null, [Validators.required]),
      }),
    })
  }

  isInvalidAutomationControl(controlName: string) {
    const control = this.automationForm.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  isInvalidConfigControl(controlName: string) {
    const configFormGroup = this.automationForm.get('config') as FormGroup;
    const control = configFormGroup.get(controlName);
    return control?.invalid && (control.touched || this.formSubmitted);
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.automationForm.valid) {
      if (this.editMode) {
        this.automationAdminService.updateAutomation({...this.automationForm.value, id: this.automationStore.automation()?.id})
          .subscribe(resp => this.automationChanged())
      }
      else {
        this.automationAdminService.createAutomation(this.automationForm.value)
          .subscribe(resp => this.automationChanged())
      }
    }
  }

  appendUsers(userId: string): void {
    const appendModel: IAppendUserModel = {
      automationId: this.automationStore.automation()?.id!,
      userIds: [userId]
    }
    this.automationAdminService.appendUsers(appendModel)
      .pipe(concatMap(() => this.automationAdminService.getAutomationAdmin(this.automationStore.automation()?.id!)))
      .subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Attached Successfully!', life: 2000 });
    })
  }

  detachUsers(userId: string): void {
    const appendModel: IAppendUserModel = {
      automationId: this.automationStore.automation()?.id!,
      userIds: [userId]
    }
    this.automationAdminService.detachUsers(appendModel)
      .pipe(concatMap(() => this.automationAdminService.getAutomationAdmin(this.automationStore.automation()?.id!)))
      .subscribe(resp => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Detached Successfully!', life: 2000 });
    })
  }

  automationChanged(): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Automation Updated Successfully!', life: 2000 });
    this.automationForm.reset();
    this.formSubmitted = false;
    this.router.navigate(['/automations'])
  }

  isUserAttached(userId: string): any {
    return this.automationStore.automation()?.users?.some(user => user.id === userId)
  }

  ngOnDestroy() {
    this.automationForm.reset();
    this.formSubmitted = false;
  }
}
