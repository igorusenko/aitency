import {Component, inject, OnInit} from '@angular/core';
import {Checkbox} from "primeng/checkbox";
import {FloatLabel} from "primeng/floatlabel";
import {InputNumber} from "primeng/inputnumber";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from "primeng/select";
import {AutomationsService} from '../../../../../core/services/admin/automation/automations.service';
import {AssistantService} from '../../../../../core/services/voice-assistant/assistant.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';

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
export class AutomationEdit implements OnInit{
  automationService = inject(AutomationsService)
  assistantService = inject(AssistantService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
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
      isActive: new FormControl(true, [Validators.required]),
      isDemo: new FormControl(true, [Validators.required]),
      serverId: new FormControl('', [Validators.required]),
      config: this.fb.group({
        voice: new FormControl(null, [Validators.required]),
        volume: new FormControl(1, [Validators.required]),
        speed: new FormControl(null, [Validators.required]),
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
      this.automationService.createAutomation(this.automationForm.value).subscribe(resp => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form Submitted', life: 3000 });
        this.automationForm.reset();
        this.formSubmitted = false;
        this.router.navigate(['/automations'])
      })
    }
  }
}
