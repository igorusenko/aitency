import {Component, inject} from '@angular/core';
import {UserStore} from '../../../../core/services/admin/user/user.store';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  userStore = inject(UserStore);
}
