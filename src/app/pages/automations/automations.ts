import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AutomationsService} from '../../services/automations.service';
import {TableModule, TableRowSelectEvent} from 'primeng/table';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-automations',
  imports: [CommonModule, FormsModule, TableModule],
  standalone: true,
  templateUrl: './automations.html',
  styleUrl: './automations.scss',
})
export class Automations implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
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

  selectRow(row: TableRowSelectEvent) {
    this.router.navigate([row.data.id], {relativeTo: this.route});
  }
}
