export interface IRegistration {
  fullName: IFullName,
  email: string,
  termsAcceptedAt: Date
}

export interface IFullName {
  firstName: string,
  lastName: string,
  middleName?: string,
}

export interface ISetPassword {
  token: string,
  password: string,
  confirmPassword: string
}
