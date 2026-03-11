import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {Toast} from 'primeng/toast';
import {Sidebar} from './sidebar/sidebar';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, SideMenuComponent, NgClass],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  standalone: true,
})
export class Layout {
  isSidebarCollapsed = false;

  onSidebarToggle(isToggled: boolean) {
    this.isSidebarCollapsed = isToggled;
  }
}
