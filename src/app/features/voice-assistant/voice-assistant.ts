import {Component, effect, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {AssistantService} from '../../core/services/voice-assistant/assistant.service';
import {ChatComponent} from './chat/chat.component';
import {AutomationsStore} from '../../core/stores/automations.store';
import {ActivatedRoute} from '@angular/router';
import {AutomationAdminService} from '../../core/services/management-system/automation/automation-admin.service';

interface ChatMessage {
  author: 'ai' | 'user';
  text: string;
}

@Component({
  selector: 'app-home',
  imports: [
    ChatComponent
  ],
  templateUrl: './voice-assistant.html',
  styleUrl: './voice-assistant.scss',
})
export class VoiceAssistant implements OnInit {
  public assistantService = inject(AssistantService);
  public automationsStore = inject(AutomationsStore);
  private readonly route = inject(ActivatedRoute);
  private readonly automationAdminService = inject(AutomationAdminService);

  calendarProcessing: WritableSignal<boolean> = signal(false);
  bookingProcessing: WritableSignal<boolean> = signal(false);
  priceInquiryProcessing: WritableSignal<boolean> = signal(false);
  serviceInfoProcessing: WritableSignal<boolean> = signal(false);
  cancelAppointmentProcessing: WritableSignal<boolean> = signal(false);
  rescheduleAppointmentProcessing: WritableSignal<boolean> = signal(false);
  handoffToHumanProcessing: WritableSignal<boolean> = signal(false);

  currentYear = new Date().getFullYear();

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.automationAdminService.getAutomationIntents(id).subscribe();
    }
  }

  constructor() {
    effect(() => {
      const intents = this.automationsStore.intents() ?? [];

      const calendarIndex = intents.findIndex((intent: any) => intent.key === 'calendar');
      if (calendarIndex > -1) intents[calendarIndex].active = this.calendarProcessing();

      const bookingIndex = intents.findIndex((intent: any) => intent.key === 'booking');
      if (bookingIndex > -1) intents[bookingIndex].active = this.bookingProcessing();

      const priceInquiryIndex = intents.findIndex((intent: any) => intent.key === 'price_inquiry');
      if (priceInquiryIndex > -1) intents[priceInquiryIndex].active = this.priceInquiryProcessing();

      const serviceInfoIndex = intents.findIndex((intent: any) => intent.key === 'service_info');
      if (serviceInfoIndex > -1) intents[serviceInfoIndex].active = this.serviceInfoProcessing();

      const cancelAppointmentIndex = intents.findIndex((intent: any) => intent.key === 'cancel_appointment');
      if (cancelAppointmentIndex > -1) intents[cancelAppointmentIndex].active = this.cancelAppointmentProcessing();

      const rescheduleAppointmentIndex = intents.findIndex((intent: any) => intent.key === 'reschedule_appointment');
      if (rescheduleAppointmentIndex > -1) intents[rescheduleAppointmentIndex].active = this.rescheduleAppointmentProcessing();

      const handoffToHumanIndex = intents.findIndex((intent: any) => intent.key === 'handoff_to_human');
      if (handoffToHumanIndex > -1) intents[handoffToHumanIndex].active = this.handoffToHumanProcessing();
    });
  }

}
