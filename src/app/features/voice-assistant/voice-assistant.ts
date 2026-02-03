import {Component, inject} from '@angular/core';
import {AssistantService} from '../../core/services/voice-assistant/assistant.service';
import {ChatComponent} from './chat/chat.component';

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
  currentYear = new Date().getFullYear();
  public assistantService = inject(AssistantService);

}
