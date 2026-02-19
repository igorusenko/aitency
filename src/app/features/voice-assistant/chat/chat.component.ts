import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Observable, from, defer, Subject } from 'rxjs';
import { switchMap, takeUntil, shareReplay } from 'rxjs/operators';
import {AssistantService} from '../../../core/services/voice-assistant/assistant.service';
import {AutomationsStore} from '../../../core/stores/automations.store';
import {ActivatedRoute} from '@angular/router';
import {UserStore} from '../../../core/services/management-system/user/user.store';
import {AutomationAdminService} from '../../../core/services/management-system/automation/automation-admin.service';
import {MessageService} from 'primeng/api';
type MessageWho = 'assistant' | 'user';

interface ChatMessage {
  text: string;
  who: MessageWho;
}

@Component({
  selector: 'app-voice-assistant',
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy{
  @ViewChild('player', { static: true }) player!: ElementRef<HTMLAudioElement>;
  @ViewChild('bottom') bottom!: ElementRef;
  private assistantService = inject(AssistantService);
  private automationsService = inject(AutomationAdminService);
  private route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  private destroy$ = new Subject<void>();
  private wsReady$?: Observable<void>;
  showEmptyState = true;
  isRecording = false;
  messages: ChatMessage[] = [];
  isAssistantSpeaking = false;

  private readonly REMOTE_WS_URL = 'wss://voice-116.aitency.net/realtime';
  private readonly LOCAL_WS_URL = 'ws://localhost:3000/realtime';
  private ws!: WebSocket;

  private audioContext: AudioContext | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;
  private micStream: MediaStream | null = null;
  private playbackContext: AudioContext | null = null;
  private audioQueue: ArrayBuffer[] = [];
  private isPlaying = false;
  private playbackTime = 0;
  private currentAudioSources: AudioBufferSourceNode[] = [];
  private lastResponseItemId: string | null = null;

  private sessionId!: string;
  private streamingServerUrl!: string;
  limitExceeded: boolean = false;

  ngOnInit(): void {
    this.automationsService.getAutomationAccess(this.route.snapshot.params['id']).subscribe(x => {
      if (x.value) this.initAssistant();
      else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Access to automation is prohibited',
          life: 2000
        });
        this.limitExceeded = true;
        this.isRecording = false;
      }
    })
  }

  private getUserMedia$(): Observable<MediaStream> {
    return from(
      navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
    );
  }

  initAssistant(): void {
    this.sessionId = this.resolveSessionId();
    this.streamingServerUrl = this.resolveWsUrl();
  }

  private resolveWsUrl(): string {
    return `${this.LOCAL_WS_URL}?automationId=${this.route.snapshot.params['id']}`;
  }

  private resolveSessionId(): string {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('sessionId', id);
    }
    return id;
  }

  toggleRecording(): void {
    this.initPlaybackContext();

    if (this.isRecording) {
      this.stopRecording();
      return;
    }

    this.ensureWebSocket$()
      .pipe(
        switchMap(() => this.getUserMedia$()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: stream => {
          this.startRecording(stream)
        },
        error: err => {
          console.error(err);
          this.addMessage('❌ Ошибка доступа к микрофону', 'assistant');
        }
      });
  }

  private startRecording(stream: MediaStream): void {
    this.micStream = stream;
    this.audioContext ??= new AudioContext({ sampleRate: 24000 });

    const ws = this.ws; // 🔒 фиксируем ссылку
    if (!ws) return;

    const source = this.audioContext.createMediaStreamSource(stream);
    const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = e => {
      if (!this.isRecording) return;
      if (ws.readyState !== WebSocket.OPEN) return;

      const input = e.inputBuffer.getChannelData(0);

      let sum = 0;
      for (const v of input) sum += Math.abs(v);
      if (sum / input.length < 0.005) return;

      const pcm = this.floatTo16BitPCM(input, this.audioContext!.sampleRate);

      ws.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: this.arrayBufferToBase64(pcm)
      }));
    };

    source.connect(processor);
    processor.connect(this.audioContext.destination);

    this.audioSource = source;
    this.audioProcessor = processor;
    this.isRecording = true;
  }

  private addMessage(text: string, who: MessageWho): void {
    this.showEmptyState = false;
    this.messages.push({ text, who });
  }

  private stopRecording(): void {
    this.isRecording = false;
    this.stopAllPlayback();

    this.audioSource?.disconnect();
    this.audioProcessor?.disconnect();
    this.micStream?.getTracks().forEach(t => t.stop());
  }

  private ensureWebSocket$(): Observable<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return defer(() => new Observable<void>(o => {
        o.next();
        o.complete();
      }));
    }

    if (!this.wsReady$) {
      this.wsReady$ = new Observable<void>(observer => {
        this.ws = new WebSocket(this.streamingServerUrl);
        this.ws.binaryType = 'arraybuffer';

        let currentAssistantDelta = '';
        let currentAssistantMessageIndex: number | null = null;

        this.ws.onopen = () => {
          console.log('[WebSocket] connected');
          observer.next();
          observer.complete();
        };

        this.ws.onerror = err => observer.error(err);

        this.ws.onmessage = e => {
          if (e.data instanceof ArrayBuffer) {
            this.enqueueAudioChunk(e.data);
            return;
          }

          try {
            const msg = JSON.parse(e.data);

            if (msg.type === 'agent.step') {
              const i = this.assistantService.systems
                .findIndex(s => s.key === msg.key);

              if (i !== -1) {
                this.assistantService.systems[i] = {
                  ...this.assistantService.systems[i],
                  active: true,
                  status: msg.step
                };
              }
            }

            if (msg.type === 'response.audio_transcript.delta') {
              this.showEmptyState = false;
              currentAssistantDelta += msg.delta;

              if (currentAssistantMessageIndex === null) {
                this.messages.push({ text: currentAssistantDelta, who: 'assistant' });
                currentAssistantMessageIndex = this.messages.length - 1;
              } else {
                this.messages[currentAssistantMessageIndex].text = currentAssistantDelta;
              }
            }

            if (msg.type === 'response.audio_transcript.done') {
              currentAssistantDelta = '';
              currentAssistantMessageIndex = null;
            }

            if (msg.type === 'response.created') {
              this.stopAllPlayback();
              this.lastResponseItemId = msg.response?.id ?? null;
            }

            if (msg.type === 'demo.limit_exceeded') {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'You have reached the limit of using automation',
                life: 3000
              });
              this.limitExceeded = true;
              this.isRecording = false;
              // this.stopAllPlayback();
              this.ws.close();
            }

          } catch {
            console.warn('[WebSocket] non json');
          }
        };

        return () => {
          // this.ws?.close();
          // this.ws = null!;
          // this.wsReady$ = undefined;
        };
      }).pipe(
        shareReplay(1)
      );
    }

    return this.wsReady$;
  }

  private initPlaybackContext(): void {
    this.playbackContext ??= new AudioContext({ sampleRate: 24000 });
    if (this.playbackContext.state === 'suspended') {
      this.playbackContext.resume();
    }
  }

  private stopAllPlayback(): void {
    this.currentAudioSources.forEach(s => s.stop());
    this.currentAudioSources = [];
    this.audioQueue = [];
    this.isPlaying = false;
    this.playbackTime = 0;
    this.isAssistantSpeaking = false;
  }

  private enqueueAudioChunk(buffer: ArrayBuffer): void {
    if (!buffer || buffer.byteLength < 100 || buffer.byteLength % 2 !== 0) {
      console.warn('[AUDIO RECEIVE] Invalid chunk:', buffer?.byteLength);
      return;
    }

    this.initPlaybackContext();
    this.audioQueue.push(buffer);
    this.isAssistantSpeaking = true;

    if (!this.isPlaying) {
      this.playbackTime = this.playbackContext!.currentTime;
      this.playNextChunk();
    }
  }

  private playNextChunk(): void {
    if (!this.audioQueue.length) {
      this.isPlaying = false;
      this.isAssistantSpeaking = false;
      console.log('[PLAYBACK] Воспроизведение завершено, можно записывать');
      return;
    }

    this.isPlaying = true;
    const chunk = this.audioQueue.shift()!;
    const view = new DataView(chunk);
    const samples = chunk.byteLength / 2;
    const float32 = new Float32Array(samples);

    for (let i = 0; i < samples; i++) {
      float32[i] = view.getInt16(i * 2, true) / 32768;
    }

    const buffer = this.playbackContext!.createBuffer(1, samples, 24000);
    buffer.copyToChannel(float32, 0);

    const source = this.playbackContext!.createBufferSource();
    source.buffer = buffer;
    source.connect(this.playbackContext!.destination);

    this.currentAudioSources.push(source);

    const startAt = Math.max(this.playbackTime, this.playbackContext!.currentTime);
    source.start(startAt);
    this.playbackTime = startAt + buffer.duration;

    source.onended = () => this.playNextChunk();
    this.scrollToBottom();
  }

  private floatTo16BitPCM(input: Float32Array, rate: number): ArrayBuffer {
    let data = input;

    if (rate === 48000) {
      const targetRate = 24000;
      const ratio = rate / targetRate;
      const outputLength = Math.floor(input.length / ratio);
      const down = new Float32Array(outputLength);

      for (let i = 0; i < outputLength; i++) {
        const srcIndex = i * ratio;
        const srcIndexFloor = Math.floor(srcIndex);
        const srcIndexCeil = Math.min(srcIndexFloor + 1, input.length - 1);
        const t = srcIndex - srcIndexFloor;
        down[i] = input[srcIndexFloor] * (1 - t) + input[srcIndexCeil] * t;
      }
      data = down;
    }

    const buffer = new ArrayBuffer(data.length * 2);
    const view = new DataView(buffer);

    data.forEach((v, i) => {
      const s = Math.max(-1, Math.min(1, v));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    });

    return buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }

    return btoa(binary);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopRecording();
    this.stopAllPlayback();
    this.ws?.close();
  }

  scrollToBottom(smooth = true) {
    this.bottom.nativeElement.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end'
    });
  }
}
