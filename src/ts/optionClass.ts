import storageClass from "./storageClass";

interface envSettings {
  envName: string;
  envUrl: string;
  message: string;
}

type envSettingsArray = Array<envSettings>;

class optionClass {
  storage: storageClass;
  constructor() {
    this.storage = new storageClass();
  }

  /**
   * saveToStorage - env settings save to storage
   * @param {Object} value - Value to save settings under
   * @return {void}
   */
  saveToStorageEnvSettings(value: Array<envSettings>): void {
    let envSettings: envSettingsArray = [];
    // 既存のenv settingsを取得
    this.getStorageEnvSettings((result: string) => {
      envSettings = this.getEnvSettings(result); // Assign the existing env settings to envSettings
      // 既存のenv settingsに新しいenv settingsを追加
      envSettings.push(value[0]);
      // env settingsをstorageに保存
      this.saveToStorageEnvSettingsArray(envSettings);
    });
  }
  /**
   * Saves the envSettings array to storage.
   * @param envSettings - The array of envSettings to be saved.
   */
  saveToStorageEnvSettingsArray(envSettings: envSettings[]) {
    this.storage.saveToStorage("env_settings", JSON.stringify(envSettings));
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

  /**
   * getStorage - env settings get from storage
   * @param {string} callback - Callback function
   */
  getStorageEnvSettings(callback: (result: string) => void) {
    this.storage.getStorage("env_settings", callback);
  }
}

export default optionClass;
