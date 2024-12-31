import { envSettings } from "../interface/types";
class validation {
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
   * validate duplicate value on url
   * @param {array} envSettings - env settings
   * @return {boolean} - true if duplicate url
   */
  isUrlDuplicate(envSettings: envSettings[]) {
    const urlArray = envSettings.map((envSetting) => envSetting.envUrl);

    // Check for duplicate URLs and return index of first duplicate URL
    const urlSet = new Set();
    for (let i = 0; i < urlArray.length; i++) {
      if (urlSet.has(urlArray[i])) {
        return i;
      }
      urlSet.add(urlArray[i]);
    }

    return -1;
  }
}

export default validation;
