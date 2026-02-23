export interface ILogItem {
  automationId: string;
  dateTime: string;
  id: string;
  logs: ILogModel;
  action: string;
  payload: null;
  timestamp: string;
  userEmail: string;
  userId: string;
}

export interface ILogModel {
  action: string;
  payload: any;
  timestamp: string;
}
