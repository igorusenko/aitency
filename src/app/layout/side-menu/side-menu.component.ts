import {Component, computed, DestroyRef, effect, inject, input, OnInit, output, ViewEncapsulation} from '@angular/core';
import { NgClass } from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../core/services/management-system/auth/auth.service';
import {UserStore} from '../../core/stores/user.store';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {debounceTime, fromEvent, map, takeUntil} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {PanelMenu} from 'primeng/panelmenu';
import {Ripple} from 'primeng/ripple';
import {MenuItem} from 'primeng/api';
import {OnboardingService} from '../../core/services/management-system/onboarding/onboarding.service';

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
  router = inject(Router);
  onboardingService = inject(OnboardingService);

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
      roles: ['Default', 'Admin'],
      items: [
        {
          path: 'billing/overview',
          title: 'Overview',
          icon: 'pi-chart-bar',
          roles: ['Default']
        },
        {
          path: 'billing/invoices',
          title: 'Invoices',
          icon: 'pi-file',
          roles: ['Default', 'Admin', 'Demo']
        },
        {
          path: 'billing/payments',
          title: 'Payments',
          icon: 'pi-credit-card',
          roles: ['Default', 'Admin', 'Demo']
        },
        {
          path: 'billing/subscriptions',
          title: 'Subscriptions',
          icon: 'pi-calendar',
          roles: ['Default', 'Demo']
        },
        {
          path: 'billing/plans',
          title: 'Plans',
          icon: 'pi-briefcase',
          roles: ['Admin']
        },
        {
          path: 'billing/usage',
          title: 'Usage',
          icon: 'pi-chart-line',
          roles: ['Default']
        },
        {
          path: 'billing/coupons',
          title: 'Coupons',
          icon: 'pi-ticket',
          roles: ['Admin']
        },
        {
          path: 'billing/settings',
          title: 'Settings',
          icon: 'pi-cog',
          roles: ['Default', 'Demo']
        }
      ]
    }
  ];

  filteredItems = computed(() => {
    const role = this.userStore.currentUser().role;

    const filterFn = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter(item => {
          const roles = (item as any)['roles'] as string[] | undefined;
          return !roles || roles.includes(role);
        })
        .map(item => {
          if (item.items && Array.isArray(item.items)) {
            const filteredChildren = filterFn(item.items as MenuItem[]);
            return {
              ...item,
              items: filteredChildren.length > 0 ? filteredChildren : undefined
            };
          }
          return item;
        })
        .filter(item => item['path'] || (item['items'] && item['items'].length > 0));
    };

    return filterFn(this.items);
  });

  isItemActive(item: MenuItem): boolean {
    if (item['path'] && this.router.isActive(item['path'], {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored'
    })) {
      return true;
    }

    if (item.items && Array.isArray(item.items)) {
      return item.items.some(child => this.isItemActive(child));
    }

    return false;
  }

  ngOnInit(): void {
    if (this.userStore.currentUser().role !== 'Demo') {
      this.getOnboardingStatus();
    }
    this.resizeListener();
  }

  getOnboardingStatus(): void {
    this.onboardingService.getOnboardingStatus().subscribe(x => {
      this.onboardingService.onboardingStatus.set(x);
    })
  }

  resizeListener(): void {
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
