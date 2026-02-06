export interface IAutomation {
  id?: string;
  users?: Array<{
    id: string;
    email: string;
  }>;
  config?: any;
  isActive: boolean;
  isDemo: boolean;
  serverId: string;
  userId: string;
}
