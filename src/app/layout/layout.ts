import { Component } from '@angular/core';
import {RouterModule, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {Toast} from 'primeng/toast';
import {Sidebar} from './sidebar/sidebar';
import {NgClass, NgIf} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, SideMenuComponent, NgClass, NgIf, ProgressSpinner],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  standalone: true,
})
export class Layout {
  isSidebarCollapsed = false;
  isNavigating = false;
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router) {
    // Отслеживаем навигацию для показа лоадера во время проверки guard
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
        this.isNavigating = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onSidebarToggle(isToggled: boolean) {
    this.isSidebarCollapsed = isToggled;
  }
}
