export interface envSettings {
  projectName: string;
  envName: string;
  envUrl: string;
  message: string;
  color: string;
  labelPosition: string;
  activeFlag: boolean;
}

export type envSettingsArray = Array<envSettings>;
