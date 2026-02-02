import {Component, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserService} from './core/services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  userService = inject(UserService);
  protected readonly title = signal('aitency');

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {})
  }
}
