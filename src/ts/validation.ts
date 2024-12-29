
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
}

export default validation;
