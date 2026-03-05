import {Component, inject, OnInit} from '@angular/core';
import {UserStore} from '../../../../core/stores/user.store';
import {AnalyticsService} from '../../../../core/services/management-system/analytics/analytics.service';
import {SelectComponent} from '../../../../shared/select/select';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../../core/services/management-system/user/user.service';
import {IUser} from '../../../../core/interfaces/users/user';
import {ScrollerOptions} from 'primeng/api';
import {SelectChangeEvent, SelectLazyLoadEvent} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-home',
  imports: [
    SelectComponent,
    ReactiveFormsModule,
    DatePicker,
    FloatLabel
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{
  userStore = inject(UserStore);
  analyticsService = inject(AnalyticsService);
  userService = inject(UserService);
  fb = inject(FormBuilder);
  analyticsForm: FormGroup;
  formSubmitted: boolean = false;
  usersLoading: boolean = false;
  users: Array<IUser> = [];
  userId: string;
  from: string;
  to: string;
  page: number = 1;
  count: number = 10;
  totalRecords: number = 0;
  options: ScrollerOptions = {
    delay: 250,
  };

  ngOnInit() {
    this.userId = this.userStore.currentUser().id
    this.initAnalyticsForm();
    if (this.userStore.currentUser().role === 'Admin') {
      this.getUsers();
      this.onDateChange();
    }
  }

  initAnalyticsForm(): void {
    this.analyticsForm = this.fb.group({
      userId: [this.userStore.currentUser().id],
      dateRange: [null],
    });
  }

  getUsers(): void {
    if (this.usersLoading) return;
    this.usersLoading = true;
    this.userService.getUsers(this.page, this.count).subscribe(res => {
      this.users = [...this.users, ...res.items];
      this.totalRecords = res.total;
      this.usersLoading = false;
    })
  }

  getAnalytics(): void {
    this.analyticsService.getAnalyticsByUserId(this.userId, this.from, this.to).subscribe(res => {})
  }

  onDateChange(): void {
    this.analyticsForm.get('dateRange')?.valueChanges.subscribe(dateRange => {
      if (dateRange && dateRange[0] && dateRange[1]) {
        const from = new Date(dateRange[0]);
        from.setHours(23, 59, 59, 999);
        const to = new Date(dateRange[1]);
        to.setHours(23, 59, 59, 999);

        this.from = this.formatDate(from);
        this.to = this.formatDate(to);
        this.getAnalytics();
      }
    })
  }

  formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  onLazyLoadUsers(event: SelectLazyLoadEvent): void {
    const { first, last } = event;

    if (last >= this.users.length && this.users.length < this.totalRecords) {
      this.page++;
      this.getUsers();
    }
  }

  onChangeUser(event: SelectChangeEvent): void {
    this.userId = event.value;
    this.getAnalytics();
  }
}
