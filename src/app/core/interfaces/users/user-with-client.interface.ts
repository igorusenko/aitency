export interface UserWithClientResponse {
  userId: string;
  clientId: string;
  email: string;
  fullName?: string | null;
}
