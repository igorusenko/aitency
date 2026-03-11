import {Component, DestroyRef, effect, inject, input, OnInit, output, ViewEncapsulation} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {AuthService} from '../../core/services/management-system/auth/auth.service';
import {UserStore} from '../../core/stores/user.store';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {debounceTime, fromEvent, map, takeUntil} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {PanelMenu} from 'primeng/panelmenu';
import {Ripple} from 'primeng/ripple';
import {MenuItem} from 'primeng/api';

/*
 * The side menu component. Template for the side menu.
 */
@Component({
  selector: 'app-side-menu',
  imports: [NgClass, RouterLink, RouterLinkActive, Button, Tooltip, PanelMenu, Ripple],
  standalone: true,
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent implements OnInit {
  authService = inject(AuthService);
  userStore = inject(UserStore);
  destroyRef = inject(DestroyRef);

  isSidebarCollapsed = input.required();
  sidebarToggle = output<boolean>();

  public readonly MOBILE_BREAKPOINT = 992;
  public isMobileView = false;
  items: MenuItem[] = [
    {
      path: 'home',
      title: 'Overview',
      icon: 'pi-home',
      roles: ['Default', 'Admin', 'Demo']
    },
    {
      path: 'automations',
      title: 'Automations',
      icon: 'pi-list-check',
      roles: ['Default', 'Admin', 'Demo']
    },
    {
      path: 'users',
      title: 'Users',
      icon: 'pi-users',
      roles: ['Admin']
    },
    {
      path: 'billing',
      title: 'Billing',
      icon: 'pi-bill',
      roles: ['Default', 'Admin', 'Demo'],
      items: [
        {
          path: 'billing/overview',
          title: 'Overview',
          roles: ['Default', 'Admin', 'Demo']
        },
        {
          path: 'billing/invoices',
          title: 'Invoices',
          roles: ['Default', 'Admin', 'Demo']
        },
        {
          path: 'billing/payments',
          title: 'Payments',
          roles: ['Default', 'Admin', 'Demo']
        },
        {
          path: 'billing/subscriptions',
          title: 'Subscriptions',
          roles: ['Default', 'Admin', 'Demo']
        },
        {
          path: 'billing/usage',
          title: 'Usage',
          roles: ['Default', 'Admin', 'Demo']
        },
        {
          path: 'billing/coupons',
          title: 'Coupons',
          roles: ['Admin']
        },
        {
          path: 'billing/settings',
          title: 'Settings',
          roles: ['Default', 'Admin', 'Demo']
        }
      ]
    }
  ];

  roleCompatability(roles: Array<string>): boolean {
    return roles.includes(this.userStore.currentUser().role)
  }

  ngOnInit(): void {
    if (window.innerWidth < this.MOBILE_BREAKPOINT) {
      this.sidebarToggle.emit(true);
    }
    else this.sidebarToggle.emit(false);

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300), // Затримка для оптимізації
        map(() => window.innerWidth),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(width => {
        if (width < this.MOBILE_BREAKPOINT) {
          this.sidebarToggle.emit(true);
        }
        else this.sidebarToggle.emit(false);
      });
  }
}
