import {Component, inject, OnInit} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {Menu} from 'primeng/menu';
import {AutomationsService} from '../../../services/automations.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-automation-details',
  imports: [PanelModule,Menu],
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

  ngOnInit() {
    this.automationService.getAutomation(this.route.snapshot.params['id']).subscribe(automation => {
      console.log(automation)
    })
  }
}
