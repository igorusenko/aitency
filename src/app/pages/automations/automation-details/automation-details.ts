import {Component, inject, OnInit} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {Menu} from 'primeng/menu';
import {AutomationsService} from '../../../core/services/automations.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {IAutomation} from '../../../core/interfaces/automations/automation-interface';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-automation-details',
  imports: [PanelModule, Menu, AsyncPipe],
  templateUrl: './automation-details.html',
  styleUrl: './automation-details.scss',
})
export class AutomationDetails implements OnInit {
  automationService = inject(AutomationsService)
  route = inject(ActivatedRoute);
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
  $automationInfo = this.automationService.getAutomation(this.route.snapshot.params['id'])

  ngOnInit() {

  }
}
