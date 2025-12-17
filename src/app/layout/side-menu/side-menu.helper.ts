export interface SideMenuItem {
  label: string;
  iconName: string;
  route: string;
  expanded?: boolean;
  children?: SideMenuItem[];
}
