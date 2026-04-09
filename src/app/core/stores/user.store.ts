import {Injectable, signal, WritableSignal} from '@angular/core';
import {IClient} from '../interfaces/billing/billing.interface';
import {IOnboardingStatus} from '../interfaces/onboarding/onboarding.iterface';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  currentUser: WritableSignal<any> = signal(undefined);
  users: WritableSignal<any> = signal(undefined);
  userById: WritableSignal<any> = signal(undefined);
  profile: WritableSignal<IClient | undefined> = signal(undefined);
  onboarding: WritableSignal<IOnboardingStatus | undefined> = signal(undefined);

  get userRole(): string {
    return this.currentUser()?.role;
  }
}
