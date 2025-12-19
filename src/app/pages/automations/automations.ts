import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LogEntry {
  timestamp?: string;
  type?: string;
  user?: string | null;
  assistant?: string | null;
  user_question?: string;
  assistant_answer?: string;
  response_id?: string;
  event_id?: string;
  sessionId?: string;
  [key: string]: any;
}

interface LogsResponse {
  status: string;
  timestamp: string;
  lines_requested: number;
  format: string;
  filter_type: string | null;
  filter_session_id: string | null;
  available_session_ids?: string[];
  logs: {
    out: (string | LogEntry)[];
    err: (string | LogEntry)[];
  };
  stats: {
    out_total: number;
    out_parsed: number;
    err_total: number;
    err_parsed: number;
  };
}

@Component({
  selector: 'app-automations',
  imports: [CommonModule, FormsModule],
  templateUrl: './automations.html',
  styleUrl: './automations.scss',
})
export class Automations implements OnInit {
  logs: LogsResponse | null = null;
  loading = false;
  error: string | null = null;
  format: 'pretty' | 'dialog' | 'raw' = 'dialog';
  lines = 100;
  filterType: string | null = null;
  filterSessionId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.error = null;
    
    const params: any = {
      format: this.format,
      lines: this.lines.toString()
    };
    
    if (this.filterType && this.filterType.trim()) {
      params.type = this.filterType.trim();
    }
    
    if (this.filterSessionId && this.filterSessionId.trim()) {
      params.sessionId = this.filterSessionId.trim();
    }

    this.http.get<LogsResponse>('https://voice-116.aitency.net/admin/logs', { params })
      .subscribe({
        next: (data) => {
          this.logs = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Ошибка загрузки логов';
          this.loading = false;
        }
      });
  }

  isLogEntry(entry: string | LogEntry): entry is LogEntry {
    return typeof entry === 'object' && entry !== null;
  }

  formatTimestamp(timestamp?: string): string {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return timestamp;
    }
  }
}
