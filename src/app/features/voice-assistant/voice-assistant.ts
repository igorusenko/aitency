import {Component, effect, inject, signal, WritableSignal} from '@angular/core';
import {AssistantService} from '../../core/services/voice-assistant/assistant.service';
import {ChatComponent} from './chat/chat.component';
import {AutomationsStore} from '../../core/stores/automations.store';

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
export class VoiceAssistant {
  public assistantService = inject(AssistantService);
  public automationsStore = inject(AutomationsStore);

  calendarProcessing: WritableSignal<boolean> = signal(false);
  bookingProcessing: WritableSignal<boolean> = signal(false);
  priceInquiryProcessing: WritableSignal<boolean> = signal(false);
  serviceInfoProcessing: WritableSignal<boolean> = signal(false);
  cancelAppointmentProcessing: WritableSignal<boolean> = signal(false);
  rescheduleAppointmentProcessing: WritableSignal<boolean> = signal(false);
  handoffToHumanProcessing: WritableSignal<boolean> = signal(false);

  currentYear = new Date().getFullYear();

  constructor() {
    effect(() => {
      const calendarIndex = this.automationsStore.intents().findIndex((intent: any) => intent.key === 'calendar')
      this.automationsStore.intents()[calendarIndex].active = this.calendarProcessing();

      const bookingIndex = this.automationsStore.intents().findIndex((intent: any) => intent.key === 'booking')
      this.automationsStore.intents()[bookingIndex].active = this.bookingProcessing();

      const priceInquiryIndex = this.automationsStore.intents().findIndex((intent: any) => intent.key === 'price_inquiry')
      this.automationsStore.intents()[priceInquiryIndex].active = this.priceInquiryProcessing();

      const serviceInfoIndex = this.automationsStore.intents().findIndex((intent: any) => intent.key === 'service_info')
      this.automationsStore.intents()[serviceInfoIndex].active = this.serviceInfoProcessing();

      const cancelAppointmentIndex = this.automationsStore.intents().findIndex((intent: any) => intent.key === 'cancel_appointment')
      this.automationsStore.intents()[cancelAppointmentIndex].active = this.cancelAppointmentProcessing();

      const rescheduleAppointmentIndex = this.automationsStore.intents().findIndex((intent: any) => intent.key === 'reschedule_appointment')
      this.automationsStore.intents()[rescheduleAppointmentIndex].active = this.rescheduleAppointmentProcessing();

      const handoffToHumanIndex = this.automationsStore.intents().findIndex((intent: any) => intent.key === 'handoff_to_human')
      this.automationsStore.intents()[handoffToHumanIndex].active = this.handoffToHumanProcessing();
    });
  }

}
