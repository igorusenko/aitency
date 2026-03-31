import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  IOnboardingStatus,
  OnboardingStepFirstRequest,
  OnboardingStepSecondRequest
} from '../../../interfaces/onboarding/onboarding.iterface';
import {environment} from '../../../../../environments/environment';
import {OnboardingStatus} from '../../../enums/common.enums';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  onboardingStatus: WritableSignal<IOnboardingStatus | undefined> = signal(undefined);

  getOnboardingStatus(): Observable<IOnboardingStatus> {
    return this.http.get<IOnboardingStatus>(`${this.apiUrl}/onboardings/status`);
  }

  setOnboardingFirstStep(firstStep: OnboardingStepFirstRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/onboardings/step-first`, firstStep)
  }

  setOnboardingSecondStep(secondStep: OnboardingStepSecondRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/onboardings/step-second`, secondStep)
  }

  skipOnboarding(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/onboardings/skip`, {});
  }
}
