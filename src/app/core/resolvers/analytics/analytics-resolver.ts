import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {AnalyticsService} from '../../services/management-system/analytics/analytics.service';
import {Observable} from 'rxjs';
import {IAnalytics} from '../../interfaces/analytics/analytics.interface';
import {UserStore} from '../../stores/user.store';

export const analyticsResolver: ResolveFn<Observable<IAnalytics>> = (route, state) => {
  const analyticsService = inject(AnalyticsService);
  const userStore = inject(UserStore);

  if (userStore.currentUser().role === 'Admin')
  return analyticsService.getAnalyticsByUserId(undefined)
  else
  return analyticsService.getMyAnalytics();
};
