import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AutomationsService} from '../../services/automations.service';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-automations',
  imports: [CommonModule, FormsModule, TableModule],
  standalone: true,
  templateUrl: './automations.html',
  styleUrl: './automations.scss',
})
export class Automations implements OnInit {
  automationService = inject(AutomationsService);
  automations: Array<any> = [];
  constructor() {}

  ngOnInit() {
    this.getAutomations();
  }

  getAutomations(): void {
    this.automationService.getAutomations().subscribe(automations => {
      this.automations = automations;
    })
  }
}
