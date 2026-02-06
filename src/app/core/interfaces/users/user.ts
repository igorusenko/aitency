export interface IUser {
  id?: string,
  email: string,
  companyName: string,
  address: string,
  contactPerson: string,
  billing: string,
  isActive: boolean
}

export interface IAppendUserModel {
  automationId: string,
  userIds: Array<string>;
}
