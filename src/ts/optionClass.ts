import storageClass from "./storageClass";

interface envSettings {
  projectName: string;
  envName: string;
  envUrl: string;
  message: string;
  color: string;
  labelPosition: string;
  activeFlag: boolean;
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
      const deleteProjectName = deleteEnvSetting.projectName;
      const deleteEnvName = deleteEnvSetting.envName;
      const deleteEnvUrl = deleteEnvSetting.envUrl;
      const color = deleteEnvSetting.color;
      const deleteMessage = deleteEnvSetting.message;
      const activeFlag = deleteEnvSetting.activeFlag;
      let isDelete = true;
      for (let j = 0; j < insertEnvSettings.length; j++) {
        const insertEnvSetting = insertEnvSettings[j];
        const insertProjectName = insertEnvSetting.projectName;
        const insertEnvName = insertEnvSetting.envName;
        const insertEnvUrl = insertEnvSetting.envUrl;
        const insertMessage = insertEnvSetting.message;
        const insertColor = insertEnvSetting.color;
        const insertActiveFlag = insertEnvSetting.activeFlag;
        if (
          deleteProjectName === insertProjectName &&
          deleteEnvName === insertEnvName &&
          deleteEnvUrl === insertEnvUrl &&
          deleteMessage === insertMessage &&
          color === insertColor &&
          activeFlag === insertActiveFlag
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
   * deleteEnvSetting - Deletes a specific environment setting from storage.
   * @param {envSettings} settingToDelete - The environment setting to delete.
   */
  deleteEnvSetting(settingToDelete: envSettings): void {
    this.getEnvSettingsFromStorageAsync().then((envSettings) => {
      const updatedEnvSettings = envSettings.filter(
        (setting) => !this.areSettingsEqual(setting, settingToDelete)
      );

      this.saveToStorageEnvSettingsArray(updatedEnvSettings);
    });
  }

  /**
   * Compares two environment settings to determine if they are equal.
   * @param {envSettings} setting1 - First environment setting.
   * @param {envSettings} setting2 - Second environment setting.
   * @return {boolean} - Returns true if settings are equal.
   */
  private areSettingsEqual(
    setting1: envSettings,
    setting2: envSettings
  ): boolean {
    return (
      setting1.projectName === setting2.projectName &&
      setting1.envName === setting2.envName &&
      setting1.envUrl === setting2.envUrl &&
      setting1.message === setting2.message &&
      setting1.color === setting2.color &&
      setting1.activeFlag === setting2.activeFlag
    );
  }

  private async getEnvSettingsFromStorageAsync(): Promise<envSettingsArray> {
    const result = await this.storage.getStorageAsync("env_settings");
    return result ? (JSON.parse(result) as envSettingsArray) : [];
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

  /**
   * validate http or https
   * @param {array} envSettings - env settings
   * @return {number} validateItem - validate result
   */
  validateHttpOrHttps(envSettings: envSettings[]) {
    let validateItem = -1;
    for (let i = 0; i < envSettings.length; i++) {
      const envSetting = envSettings[i];
      const envUrl = envSetting.envUrl;
      if (
        envUrl.indexOf("http://") === -1 &&
        envUrl.indexOf("https://") === -1
      ) {
        validateItem = i;
        break;
      }
    }
    return validateItem;
  }

  /**
   * validate empty value
   * @param {envSettings[]} envSettings - env settings
   * @returns {object} - An object containing the index and the name of the empty field
   */
  validateEmptyValue(
    envSettings: envSettings[]
  ): { index: number; field: string; target: string } | null {
    for (let i = 0; i < envSettings.length; i++) {
      const envSetting = envSettings[i];
      if (envSetting.projectName === "") {
        return { index: i, field: "案件名", target: "project_name" };
      }
      if (envSetting.envName === "") {
        return { index: i, field: "環境名", target: "env_name" };
      }
      if (envSetting.envUrl === "") {
        return { index: i, field: "URL", target: "env_url" };
      }
    }
    return null;
  }

  /**
   * get form all data
   * @return {envSettings[]} - env settings
   */
  getAllFormData(): envSettings[] {
    const envSettingsTableBody = document.getElementById(
      "env_settings_table_body"
    ) as HTMLTableSectionElement;
    const envSettingsTableRows = envSettingsTableBody.getElementsByClassName(
      "env_settings_form_data"
    );
    const envSettingsArray: envSettings[] = [];
    // Loop through the number of tr elements
    for (let i = 0; i < envSettingsTableRows.length; i++) {
      const envSettingsTableRow = envSettingsTableRows[
        i
      ] as HTMLTableRowElement;
      const projectName = (
        envSettingsTableRow.getElementsByClassName(
          "project_name"
        )[0] as HTMLInputElement
      ).value;
      const envName = (
        envSettingsTableRow.getElementsByClassName(
          "env_name"
        )[0] as HTMLInputElement
      ).value;
      const envUrl = (
        envSettingsTableRow.getElementsByClassName(
          "env_url"
        )[0] as HTMLInputElement
      ).value;
      const message = (
        envSettingsTableRow.getElementsByClassName(
          "message"
        )[0] as HTMLInputElement
      ).value;
      const color = (
        envSettingsTableRow.getElementsByClassName(
          "color"
        )[0] as HTMLInputElement
      ).value;
      const labelPosition = (
        envSettingsTableRow.getElementsByClassName(
          "label"
        )[0] as HTMLInputElement
      ).value;
      const activeFlag = (
        envSettingsTableRow.getElementsByClassName(
          "active_flag"
        )[0] as HTMLInputElement
      ).checked;
      envSettingsArray.push({
        projectName: projectName,
        envName: envName,
        envUrl: envUrl,
        message: message,
        color: color,
        labelPosition: labelPosition,
        activeFlag: activeFlag,
      });
    }
    return envSettingsArray;
  }
}

export default optionClass;
