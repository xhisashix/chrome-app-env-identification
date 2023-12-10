import storageClass from "./storageClass";

interface envSettings {
  envName: string;
  envUrl: string;
  message: string;
}

class optionClass {
  storage: storageClass;
  constructor() {
    this.storage = new storageClass();
  }

  /**
   * saveToStorage - env settings save to storage
   * @param {string} value - Value to save settings under
   * @return {void}
   */
  saveToStorageEnvSettings(value: string) {
    this.storage.saveToStorage("env_settings", value);
  }

  /**
   * getStorage - env settings get from storage
   * @param {string} callback - Callback function
   */
  getStorageEnvSettings(callback: (result: string) => void) {
    this.storage.getStorage("env_settings", callback);
  }
}

export default optionClass