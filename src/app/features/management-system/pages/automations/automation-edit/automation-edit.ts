import {Component, inject, OnDestroy, OnInit, Signal} from '@angular/core';
import {Checkbox} from "primeng/checkbox";
import {FloatLabel} from "primeng/floatlabel";
import {InputNumber} from "primeng/inputnumber";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from "primeng/select";
import {AutomationAdminService} from '../../../../../core/services/admin/automation/automation-admin.service';
import {AssistantService} from '../../../../../core/services/voice-assistant/assistant.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {IAutomation} from '../../../../../core/interfaces/automations/automation-interface';

@Component({
  selector: 'app-automation-edit',
    imports: [
        Checkbox,
        FloatLabel,
        InputNumber,
        InputText,
        Message,
        ReactiveFormsModule,
        Select
    ],
  templateUrl: './automation-edit.html',
  styleUrl: './automation-edit.scss',
})
export class AutomationEdit implements OnInit, OnDestroy {
  automationAdminService = inject(AutomationAdminService)
  assistantService = inject(AssistantService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);

  automation: Signal<IAutomation> = toSignal(
    inject(ActivatedRoute).data.pipe(
      map(data => data['automation'])
    )
  );

  editMode: boolean = Boolean(this.automation()) ?? false;

  voices = [
    { name: 'alloy' },
    { name: 'echo' },
    { name: 'shimmer' },
    { name: 'marin' },
    { name: 'cedar' }
  ];
  automationForm: FormGroup;
  formSubmitted: boolean = false;
  $assistantVoices = this.assistantService.getVoices();

  ngOnInit() {
    this.initAutomationForm();
  }

  initAutomationForm(): void {
    this.automationForm = this.fb.group({
      isActive: new FormControl(this.automation()?.isActive ?? true, [Validators.required]),
      isDemo: new FormControl(this.automation()?.isDemo ?? true, [Validators.required]),
      serverId: new FormControl(this.automation()?.serverId ?? '', [Validators.required]),
      config: this.fb.group({
        voice: new FormControl(this.automation()?.config?.voice ?? null, [Validators.required]),
        volume: new FormControl(this.automation()?.config?.volume ?? 1, [Validators.required]),
        speed: new FormControl(this.automation()?.config?.speed ?? null, [Validators.required]),
      })
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
        this.automationAdminService.updateAutomation({...this.automationForm.value, id: this.automation().id}).subscribe(resp => this.automationChanged())
      }
      else {
        this.automationAdminService.createAutomation(this.automationForm.value).subscribe(resp => this.automationChanged())
      }
    }
  }

  automationChanged(): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Automation Updated Successfully!', life: 2000 });
    this.automationForm.reset();
    this.formSubmitted = false;
    this.router.navigate(['/automations'])
  }

  ngOnDestroy() {
    this.automationForm.reset();
    this.formSubmitted = false;
  }
}
