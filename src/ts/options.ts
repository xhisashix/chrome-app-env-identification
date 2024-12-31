import { DomElements } from "./interface/elementInterface";
import envSettingsManager from "./utils/envSettingsManager";
import message from "./utils/Message";
import tableUtils from "./utils/tableUtils";
import validation from "./utils/validation";
import Papa from "papaparse";
import { envSettings } from "./interface/types";

const EnvSettingsManagerClass = new envSettingsManager();
const Message = new message();
const TableUtils = new tableUtils();
const Validation = new validation();

/**
 * Initializes the options page by setting up event handlers and retrieving environment settings.
 * This function is called when the options page is loaded.
 */
function init() {
  setupEventHandlers();
  getEnvSettings();
}

/**
 * Sets up event handlers for the options page.
 */
function setupEventHandlers() {
  const saveEnv = document.getElementById(
    DomElements.saveButton
  ) as HTMLButtonElement;
  saveEnv.addEventListener("click", handleSaveEnv);

  const addEnv = document.getElementById(
    DomElements.addEnv
  ) as HTMLButtonElement;
  addEnv.addEventListener("click", TableUtils.addEnvSettingsRow);

  const csvUpload = document.getElementById(
    DomElements.csvUpload
  ) as HTMLInputElement;
  csvUpload.addEventListener("change", handleCsvUpload);
}

/**
 * Handles the upload of a CSV file.
 */
function handleCsvUpload() {
  const fileInput = document.getElementById(
    DomElements.csvUpload
  ) as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        const data = results.data as envSettings[];
        data.forEach((envSetting) => {
          TableUtils.addEnvSettingToTable(envSetting);
        });
      },
    });
  }
}

/**
 * save env settings
 */
function handleSaveEnv() {
  const envSettings = EnvSettingsManagerClass.getAllFormData();
  const validateEmptyResult = Validation.validateEmptyValue(envSettings);
  const validateUrlResult = Validation.validateHttpOrHttps(envSettings);
  const validateDuplicateResult = Validation.isUrlDuplicate(envSettings);

  if (validateEmptyResult) {
    Message.showValidationError(
      validateEmptyResult.index,
      validateEmptyResult.target
    );
    alert(
      `${validateEmptyResult.index + 1}行目の${
        validateEmptyResult.field
      }を入力してください。`
    );
    return;
  }

  if (validateUrlResult !== -1) {
    Message.showValidationError(validateUrlResult, DomElements.envUrl);
    alert(
      `${
        validateUrlResult + 1
      }行目のURLはhttp://またはhttpsから始まる必要があります。`
    );
    return;
  }

  if (validateDuplicateResult !== -1) {
    Message.showValidationError(validateDuplicateResult, DomElements.envUrl);
    alert("URLが重複しています。");
    return;
  }

  EnvSettingsManagerClass.saveToStorageEnvSettings(envSettings);
  Message.flashMessage();
}

/**
 * get env settings from storage
 * @return {Array} envSettings - env settings
 * @return {void}
 */
function getEnvSettings() {
  EnvSettingsManagerClass.getStorageEnvSettings(function (result: string) {
    const envSettings = EnvSettingsManagerClass.getEnvSettings(result);
    TableUtils.createEnvSettingsTableList(envSettings);
  });
}

init();
