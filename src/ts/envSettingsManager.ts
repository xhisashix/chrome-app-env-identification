import StorageClass from "./storageClass";
import { envSettings } from "./types";

class EnvSettingsManager {
  private storage: StorageClass;

  constructor() {
    this.storage = new StorageClass();
  }

  /**
   * getEnvSettings - env settings get from storage
   * @param {string} result - env settings
   * @return {Array} envSettings - env settings
   */
  getEnvSettings(result: string): envSettings[] {
    if (result) {
      return JSON.parse(result);
    } else {
      return [];
    }
  }
}

export default EnvSettingsManager;
