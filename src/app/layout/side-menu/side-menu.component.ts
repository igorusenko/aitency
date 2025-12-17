import {Component, effect, OnInit, ViewEncapsulation} from '@angular/core';
import { SideMenuService } from './side-menu.service';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SideMenuItem } from './side-menu.helper';

/*
 * The side menu component. Template for the side menu.
 */
@Component({
  selector: 'app-side-menu',
  imports: [NgClass, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent implements OnInit {
  public readonly MOBILE_BREAKPOINT = 992;
  public isMobileView = false;
  /*
   * List of menu items to be displayed in the side menu.
   */
  items: SideMenuItem[] = [];

  /*
   * Available icon names and colors for menu items.
   */


  constructor(public sideMenuService: SideMenuService) {
    /*
     * Effect to update the menu items whenever they change in the SideMenuService.
     */
    effect(() => {
      this.items = sideMenuService.sideMenuItems();
    });
  }

  /*
   * Toggles the collapsed state of the side menu.
   */
  toggleSideMenu() {
    this.sideMenuService.isSideMenuCollapsed.set(!this.sideMenuService.isSideMenuCollapsed());
  }

  /*
   * Toggles the expanded state of a specific menu item.
   * @param item The menu item to expand or collapse.
   */
  toggleExpand(item: SideMenuItem) {
    item.expanded = !item.expanded;
  }

  navLinkClick() {
    if (window.innerWidth < this.sideMenuService.MOBILE_BREAKPOINT) {
      this.sideMenuService.isSideMenuCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    if (window.innerWidth < this.MOBILE_BREAKPOINT) {
      this.isMobileView = true;
    }
  }
}
