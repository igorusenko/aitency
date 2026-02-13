import {Component, inject} from '@angular/core';
import {PanelModule} from 'primeng/panel';
import {Menu} from 'primeng/menu';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {map} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {UserStore} from '../../../../../core/services/management-system/user/user.store';

@Component({
  selector: 'app-automation-details',
  imports: [PanelModule, ReactiveFormsModule, Menu, RouterLink],
  templateUrl: './automation-details.html',
  styleUrl: './automation-details.scss',
})
export class AutomationDetails {
  userStore = inject(UserStore);
  automation = toSignal(
    inject(ActivatedRoute).data.pipe(
      map(data => data['automation'])
    )
  );
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
}
