import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AutomationsService} from '../../../../core/services/admin/automation/automations.service';
import {TableModule, TableRowSelectEvent} from 'primeng/table';
import {ActivatedRoute, Router} from '@angular/router';
import {IPaginatedList} from '../../../../core/interfaces/paginated-list-interface';
import {IAutomation} from '../../../../core/interfaces/automations/automation-interface';
import {Observable} from 'rxjs';

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
  $automations = this.automationService.getAutomations();

  constructor() {}

  ngOnInit() {

  }

  selectRow(row: TableRowSelectEvent) {
    this.router.navigate([row.data.id], {relativeTo: this.route});
  }
}
