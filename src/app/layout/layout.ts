import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {SideMenuComponent} from './side-menu/side-menu.component';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, SideMenuComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  standalone: true,
})
export class Layout {

}
