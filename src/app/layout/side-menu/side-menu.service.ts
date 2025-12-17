import { Injectable, OnDestroy, signal } from '@angular/core';
import { SideMenuItem } from './side-menu.helper';
import { debounceTime, fromEvent, map, Subject, takeUntil } from 'rxjs';

/*
 * Service to manage the state of the side menu, including its visibility and items.
 */
@Injectable({
  providedIn: 'root',
})
export class SideMenuService implements OnDestroy {
  /*
   * Screen width threshold (in pixels) for switching to mobile mode.
   * If the window width is below this value, the side menu will be collapsed by default.
   */
  public readonly MOBILE_BREAKPOINT = 992;

  /*
   * Signal representing whether the side menu is collapsed or expanded.
   * True - collapsed, False - expanded.
   */
  isSideMenuCollapsed = signal(false);

  /*
   * Signal holding the list of items displayed in the side menu.
   */
  sideMenuItems = signal<SideMenuItem[]>([]);

  private destroy$ = new Subject<void>();

  /*
   * Initializes the side menu state based on the current screen width.
   * If the screen width is less than MOBILE_BREAKPOINT, the menu is collapsed.
   */
  constructor() {

    if (window.innerWidth < this.MOBILE_BREAKPOINT) {
      this.isSideMenuCollapsed.set(true);
    }

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(300), // Затримка для оптимізації
        map(() => window.innerWidth),
        takeUntil(this.destroy$)
      )
      .subscribe(width => {
        if (width < this.MOBILE_BREAKPOINT) {
          this.isSideMenuCollapsed.set(true);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
