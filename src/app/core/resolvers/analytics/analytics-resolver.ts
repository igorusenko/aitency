import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {AnalyticsService} from '../../services/management-system/analytics/analytics.service';
import {Observable} from 'rxjs';
import {IAnalytics} from '../../interfaces/analytics/analytics.interface';

export const analyticsResolver: ResolveFn<Observable<IAnalytics>> = (route, state) => {
  const analyticsService = inject(AnalyticsService);

  return analyticsService.getMyAnalytics();
};
