import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AutomationAdminService} from '../../../../../core/services/management-system/automation/automation-admin.service';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {concatMap} from 'rxjs';
import {AutomationsStore} from '../../../../../core/stores/automations.store';
import {IAppendUserModel} from '../../../../../core/interfaces/users/user';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {InputTextComponent} from '../../../../../shared/input-text/input-text';
import {Checkbox} from '../../../../../shared/checkbox/checkbox';
import {SelectComponent} from '../../../../../shared/select/select';
import {InputNumberComponent} from '../../../../../shared/input-number/input-number';
import {Menu} from 'primeng/menu';
import {Panel} from 'primeng/panel';
import {WorkspacesStore} from '../../../../../core/stores/workspaces.store';
import {WorkspacesService} from '../../../../../core/services/management-system/workspaces/workspaces.service';

@Component({
  selector: 'app-automation-edit',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    Button,
    TableModule,
    Menu,
    Panel,
    InputTextComponent,
    Checkbox,
    SelectComponent,
    InputNumberComponent,
  ],
  templateUrl: './automation-edit.html',
  styleUrl: './automation-edit.scss',
})
export class AutomationEdit implements OnInit, OnDestroy {
  automationAdminService = inject(AutomationAdminService)
  automationStore = inject(AutomationsStore);
  // userStore = inject(UserStore);
  workspacesStore = inject(WorkspacesStore);
  workspacesService = inject(WorkspacesService);
  router = inject(Router);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  usersMappedToAppend: IAppendUserModel;
  editMode: boolean = Boolean(this.automationStore.automation()) ?? false;
  linkedUsers = [];

  assistantTypes = [
    { name: 'Reception AI Agent(Demo)' }
  ]

  voices = [
    { name: 'alloy' },
    { name: 'echo' },
    { name: 'shimmer' },
    { name: 'marin' },
    { name: 'ash' },
    { name: 'cedar' }
  ];
  items = [
    {
      label: 'Refresh',
      icon: 'pi pi-refresh'
    },
    {
      label: 'Search',
      icon: 'pi pi-search'
    },
    {
      separator: true
    },
    {
      label: 'Delete',
      icon: 'pi pi-times'
    }
  ]
  automationForm: FormGroup;
  formSubmitted: boolean = false;

  ngOnInit() {
    this.initAutomationForm();
    this.usersMappedToAppend = {
      automationId: this.automationStore.automation()?.id!,
      userIds: this.workspacesStore.workspaces().items.map((workspace: any) => workspace.id)
    }
  }

  initAutomationForm(): void {
    this.automationForm = this.fb.group({
      isActive: new FormControl(this.automationStore.automation()?.isActive ?? true, [Validators.required]),
      isDemo: new FormControl(this.automationStore.automation()?.isDemo ?? true, [Validators.required]),
      serverId: new FormControl(this.automationStore.automation()?.serverId ?? '', [Validators.required]),
      config: this.fb.group({
        voice: new FormControl(this.automationStore.automation()?.config?.voice ?? null, [Validators.required]),
        speed: new FormControl(this.automationStore.automation()?.config?.speed ?? 1.2, [Validators.required]),
        instructions: new FormControl(this.automationStore.automation()?.config?.instructions ?? null, [Validators.required]),
        tools: new FormControl([]),
      }),
      assistantType: new FormControl('Reception AI Agent(Demo)'),
    })
  }

  getConfigForm(): FormGroup {
    return this.automationForm.get('config') as FormGroup;
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

  appendWorkspace(workSpaceId: string): void {
    this.workspacesService.appendWorkspace(this.automationStore.automation()?.id!, [workSpaceId])
      .pipe(concatMap(() => this.automationAdminService.getAutomationAdmin(this.automationStore.automation()?.id!)))
      .subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace appended to automation!', life: 2000 });
    })
  }

  detachWorkspace(workSpaceId: string): void {
    this.workspacesService.detachWorkspace(this.automationStore.automation()?.id!, [workSpaceId])
      .pipe(concatMap(() => this.automationAdminService.getAutomationAdmin(this.automationStore.automation()?.id!)))
      .subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Workspace detached from automation!', life: 2000 });
    })
  }

  isWorkspaceAttached(workspaceId: string): boolean {
    return this.automationStore.automation()?.workspaces.some(x => x.id === workspaceId)!;
  }

  ngOnDestroy() {
    this.automationForm.reset();
    this.automationStore.automation.set(undefined)
    this.formSubmitted = false;
  }
}
