import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
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
import {FieldType} from '../../../../../core/interfaces/automations/ui-config.interface';
import {UserStore} from '../../../../../core/stores/user.store';

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
  userStore = inject(UserStore);
  workspacesStore = inject(WorkspacesStore);
  workspacesService = inject(WorkspacesService);
  router = inject(Router);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  usersMappedToAppend: IAppendUserModel;
  editMode: boolean = Boolean(this.automationStore.automation()) ?? false;
  linkedUsers = [];

  assistantTypes = [
    { name: 'Reception AI Agent(Demo)' },
    { name: 'Other' },
  ]

  voices = [
    { name: 'alloy' },
    { name: 'echo' },
    { name: 'shimmer' },
    { name: 'marin' },
    { name: 'ash' },
    { name: 'cedar' }
  ];

  fieldTypes = Object.entries(FieldType).map(([key, value]) => ({
    label: key,
    value: value
  }));

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

  get sections(): FormArray {
    return this.automationForm.get('uiConfig.sections') as FormArray;
  }

  getSectionGroup(index: number): FormGroup {
    return this.sections.at(index) as FormGroup;
  }

  getFields(sectionIndex: number): FormArray {
    return this.getSectionGroup(sectionIndex).get('fields') as FormArray;
  }

  getFieldGroup(sectionIndex: number, fieldIndex: number): FormGroup {
    return this.getFields(sectionIndex).at(fieldIndex) as FormGroup;
  }

  getValidationGroup(sectionIndex: number, fieldIndex: number): FormGroup {
    return this.getFieldGroup(sectionIndex, fieldIndex).get('validation') as FormGroup;
  }

  ngOnInit() {
    this.initAutomationForm();
    this.usersMappedToAppend = {
      automationId: this.automationStore.automation()?.id!,
      userIds: this.workspacesStore.workspaces().items.map((workspace: any) => workspace.id)
    }
  }

  initAutomationForm(): void {
    const automation = this.automationStore.automation();

    this.automationForm = this.fb.group({
      isActive: new FormControl(automation?.isActive ?? true, [Validators.required]),
      isDemo: new FormControl(automation?.isDemo ?? true, [Validators.required]),
      serverId: new FormControl(automation?.serverId ?? '', [Validators.required]),

      config: this.fb.group({
        voice: new FormControl(automation?.config?.voice ?? null, [Validators.required]),
        speed: new FormControl(automation?.config?.speed ?? 1.2, [Validators.required]),
        instructions: new FormControl(automation?.config?.instructions ?? null, [Validators.required]),
        tools: new FormControl(automation?.config?.tools ?? []),
      }),

      uiConfig: this.fb.group({
        sections: this.fb.array(
          automation?.uiConfig?.sections?.map(section =>
            this.createSection(section)
          ) ?? []
        )
      }),

      assistantType: new FormControl('Reception AI Agent(Demo)'),
    });
  }

  private createField(field?: any): FormGroup {
    return this.fb.group({
      key: [field?.key ?? '', Validators.required],
      label: [field?.label ?? '', Validators.required],
      help: [field?.help ?? ''],
      type: [field?.type ?? 'string', Validators.required],
      visible: [field?.visible ?? true],
      editable: [field?.editable ?? true],
      required: [field?.required ?? false],
      redact: [field?.redact ?? false],
      value: [field?.value ?? null, Validators.required],

      validation: this.fb.group({
        regex: [field?.validation?.regex ?? null],
        min: [field?.validation?.min ?? null],
        max: [field?.validation?.max ?? null],
        enum: [field?.validation?.enum ?? []],
      }),
    });
  }

  private createSection(section?: any): FormGroup {
    return this.fb.group({
      id: [section?.id ?? '', Validators.required],
      title: [section?.title ?? '', Validators.required],
      fields: this.fb.array(
        section?.fields?.map((field: any) =>
          this.createField(field)
        ) ?? []
      )
    });
  }

  getConfigForm(): FormGroup {
    return this.automationForm.get('config') as FormGroup;
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

  addDynamicConfig(): void {
    this.sections.push(this.createSection());
  }

  addDynamicField(sectionIndex: number): void {
    this.getFields(sectionIndex).push(this.createField())
  }

  deleteField(sectionIndex: number, fieldIndex: number): void {
    const fields = this.getFields(sectionIndex);

    if (!fields || fieldIndex < 0 || fieldIndex >= fields.length) {
      return;
    }

    fields.removeAt(fieldIndex);
  }

  deleteSection(index: number): void {
    if (!this.sections || index < 0 || index >= this.sections.length) {
      return;
    }

    this.sections.removeAt(index);
  }

  ngOnDestroy() {
    this.automationForm.reset();
    this.automationStore.automation.set(undefined)
    this.formSubmitted = false;
    this.automationStore.intents.set(undefined)
  }
}
