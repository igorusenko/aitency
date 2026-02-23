import {IWorkspace} from '../workspace/workspace.interface';

export interface IUser {
  id?: string,
  email: string,
  companyName: string,
  address: string,
  contactPerson: string,
  billing: string,
  isActive: boolean,
  emailConfirmed: boolean,
  fullName: string,
  onboardingStatus: string,
  onboardingStep: string,
  registrationDate: string,
  termsAcceptedAt: string,
  timezone: string,
  workspaces: Array<IWorkspace>
}

export interface IAppendUserModel {
  automationId: string,
  userIds: Array<string>;
}
