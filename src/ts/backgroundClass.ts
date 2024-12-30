import storageClass from "./utils/storageClass";

interface envSettings {
  envName: string;
  envUrl: string;
  message: string;
  color: string;
}

class backgroundClass {
  constructor() {
    this.storage = new storageClass();
  }

  public storage: storageClass;

  /**
   * get env url
   * @param envSettings env settings
   * @param tabUrl tab url
   * @returns env url
   */
  getEnvUrl(envSettings: envSettings[], tabUrl: string): string {
    let envUrl = "";
    for (let i = 0; i < envSettings.length; i++) {
      if (this.checkIncludeUrl(envSettings[i].envUrl, tabUrl)) {
        envUrl = envSettings[i].envUrl;
        break;
      }
    }
    return envUrl;
  }

  /**
   * get env settings
   * @param envSettings env settings
   * @param tabUrl tab url
   * @returns env settings
   */
  getEnv(envSettings: envSettings[], tabUrl: string): envSettings {
    let envSetting = {} as envSettings;
    for (let i = 0; i < envSettings.length; i++) {
      if (this.checkIncludeUrl(envSettings[i].envUrl, tabUrl)) {
        envSetting = envSettings[i];
        break;
      }
    }
    return envSetting;
  }

  /**
   * get env settings array
   * @param result result
   * @returns env settings array
   */
  getEnvSettingsArray(result: string): envSettings[] {
    if (result) {
      return JSON.parse(result);
    } else {
      return [];
    }
  }

  /**
   * check include url
   * @param envUrl env url
   * @param tabUrl tab url
   * @returns boolean
   */
  checkIncludeUrl(envUrl: string, tabUrl: string) {
    if (tabUrl === undefined) {
      return false;
    }
    return tabUrl.includes(envUrl);
  }
}

export default backgroundClass;
