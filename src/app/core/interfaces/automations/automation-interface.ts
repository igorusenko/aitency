export interface IAutomation {
  id?: string;
  workspaces: Array<IWorkspace>;
  serverId: string;
  isDemo: boolean;
  isActive: boolean;

  config?: IAutomationConfig;
}

export interface IWorkspace {
  id: string;
  ownerId: string;
}

export interface IAutomationConfig {
  instructions: string;
  voice: string;
  speed: number;
  tools: Array<IAutomationConfigTool>;
}

export interface IAutomationConfigTool {
  type: string;
  name: string;
  description: string;
  parameters: IAutomationConfigToolParameter;
}

export interface IAutomationConfigToolParameter {
  type: string;
  properties: any;
}
