import {Component, inject, OnInit} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {Menu} from 'primeng/menu';
import {AutomationsService} from '../../../../../core/services/admin/automation/automations.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Observable} from 'rxjs';
import {IAutomation} from '../../../../../core/interfaces/automations/automation-interface';
import {AsyncPipe} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {MessageService} from 'primeng/api';
import {Message, MessageModule} from 'primeng/message';
import {Checkbox} from 'primeng/checkbox';
import {AssistantService} from '../../../../../core/services/voice-assistant/assistant.service';
import {Select} from 'primeng/select';
import {InputNumber} from 'primeng/inputnumber';
import {FloatLabel} from 'primeng/floatlabel';
import {Toast, ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-automation-details',
  imports: [PanelModule, Menu, AsyncPipe, RouterLink, ReactiveFormsModule, InputText, MessageModule, Checkbox, Select, InputNumber, FloatLabel, ToastModule],
  templateUrl: './automation-details.html',
  styleUrl: './automation-details.scss',
})
export class AutomationDetails implements OnInit {
  automationService = inject(AutomationsService)
  assistantService = inject(AssistantService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
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

  voices = [
    { name: 'alloy' },
    { name: 'echo' },
    { name: 'shimmer' },
    { name: 'marin' },
    { name: 'cedar' }
  ];

  $automationInfo = this.automationService.getAutomation(this.route.snapshot.params['id']);
  $assistantVoices = this.assistantService.getVoices();
  automationForm: FormGroup;
  formSubmitted: boolean = false;

  ngOnInit() {
    if (this.route.snapshot.params['id'] === 'new')
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
      })
    }
  }
}
