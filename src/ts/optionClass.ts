import storageClass from "./storageClass";

interface envSettings {
  envName: string;
  envUrl: string;
  message: string;
  color: string;
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
    if (value) {
      envSettings = value;
    }

    // data to delete and insert
    const deleteEnvSettings = this.getEnvSettingsFromStorage();
    const insertEnvSettings = envSettings;

    // delete and insert
    this.deleteEnvSettings(deleteEnvSettings, insertEnvSettings);

    // save to storage
    this.saveToStorageEnvSettingsArray(envSettings);
  }

  /**
   * getEnvSettingsFromStorage - env settings get from storage
   * @return {Array} envSettings - env settings
   */
  getEnvSettingsFromStorage(): envSettingsArray {
    let envSettings: envSettingsArray = [];
    this.getStorageEnvSettings(function (result: string) {
      envSettings = JSON.parse(result);
    });
    return envSettings;
  }

  /**
   * deleteEnvSettings - env settings delete from storage
   * @param {Array} deleteEnvSettings - env settings to delete
   * @param {Array} insertEnvSettings - env settings to insert
   */
  deleteEnvSettings(
    deleteEnvSettings: envSettingsArray,
    insertEnvSettings: envSettingsArray
  ) {
    // delete
    for (let i = 0; i < deleteEnvSettings.length; i++) {
      const deleteEnvSetting = deleteEnvSettings[i];
      const deleteEnvName = deleteEnvSetting.envName;
      const deleteEnvUrl = deleteEnvSetting.envUrl;
      const color = deleteEnvSetting.color;
      const deleteMessage = deleteEnvSetting.message;
      let isDelete = true;
      for (let j = 0; j < insertEnvSettings.length; j++) {
        const insertEnvSetting = insertEnvSettings[j];
        const insertEnvName = insertEnvSetting.envName;
        const insertEnvUrl = insertEnvSetting.envUrl;
        const insertMessage = insertEnvSetting.message;
        const insertColor = insertEnvSetting.color;
        if (
          deleteEnvName === insertEnvName &&
          deleteEnvUrl === insertEnvUrl &&
          deleteMessage === insertMessage &&
          color === insertColor
        ) {
          isDelete = false;
          break;
        }
      }
      if (isDelete) {
        this.deleteEnvSetting(deleteEnvSetting);
      }
    }
  }

  /**
   * deleteEnvSetting - env setting delete from storage
   * @param {Object} deleteEnvSetting - env setting to delete
   */
  deleteEnvSetting(deleteEnvSetting: envSettings) {
    const deleteEnvName = deleteEnvSetting.envName;
    const deleteEnvUrl = deleteEnvSetting.envUrl;
    const deleteMessage = deleteEnvSetting.message;
    const deleteColor = deleteEnvSetting.color;
    const deleteEnvSettings = this.getEnvSettingsFromStorage();
    for (let i = 0; i < deleteEnvSettings.length; i++) {
      const deleteEnvSetting = deleteEnvSettings[i];
      const envName = deleteEnvSetting.envName;
      const envUrl = deleteEnvSetting.envUrl;
      const message = deleteEnvSetting.message;
      const color = deleteEnvSetting.color;
      if (
        deleteEnvName === envName &&
        deleteEnvUrl === envUrl &&
        deleteMessage === message &&
        deleteColor === color
      ) {
        deleteEnvSettings.splice(i, 1);
        break;
      }
    }
    this.saveToStorageEnvSettingsArray(deleteEnvSettings);
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
