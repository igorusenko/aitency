import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, SideMenuComponent, Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  standalone: true,
})
export class Layout {

}
