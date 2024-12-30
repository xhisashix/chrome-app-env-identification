import { DomElements } from "./interface/elementInterface";
import envSettingsManager from "./utils/envSettingsManager";
import tableUtils from "./utils/tableUtils";
import validation from "./utils/validation";
import Papa from "papaparse";
import { envSettings } from "./interface/types";

const EnvSettingsManagerClass = new envSettingsManager();
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
    showValidationError(validateEmptyResult.index, validateEmptyResult.target);
    alert(
      `${validateEmptyResult.index + 1}行目の${
        validateEmptyResult.field
      }を入力してください。`
    );
    return;
  }

  if (validateUrlResult !== -1) {
    showValidationError(validateUrlResult, DomElements.envUrl);
    alert(
      `${
        validateUrlResult + 1
      }行目のURLはhttp://またはhttpsから始まる必要があります。`
    );
    return;
  }

  if (validateDuplicateResult !== -1) {
    showValidationError(validateDuplicateResult, DomElements.envUrl);
    showValidationError;
    alert("URLが重複しています。");
    return;
  }

  EnvSettingsManagerClass.saveToStorageEnvSettings(envSettings);
  flashMessage();
}

/**
 * Displays a validation error message for an invalid URL.
 * @param {number} validateResult - The index of the row with the invalid URL.
 * @param {string} target - The target element to which the error message should be displayed.
 */
function showValidationError(validateResult: number, target: string) {
  // Add focus to the input element of the line that caused the error
  const envSettingsTableBody = document.getElementById(
    "env_settings_table_body"
  ) as HTMLTableSectionElement;
  const envSettingsTableRows = envSettingsTableBody.getElementsByClassName(
    "env_settings_form_data"
  );

  const errorRow = envSettingsTableRows[validateResult] as HTMLTableRowElement;
  const errorInput = errorRow.getElementsByClassName(
    target
  )[0] as HTMLInputElement;
  errorInput.classList.add("border-red-500");
  errorInput.focus();

  // Remove the error message when the input element is changed
  errorInput.addEventListener("input", function () {
    errorInput.classList.remove("border-red-500");
  });
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

/**
 * flash message
 */
function flashMessage() {
  const flashMessage = document.getElementById("flash_message") as HTMLElement;
  flashMessage.classList.remove("hidden");
  setTimeout(function () {
    flashMessage.classList.add("hidden");
  }, 2000);
}

init();
