import envSettingsManager from "./envSettingsManager";
import validation from "./validation";
import Papa from "papaparse";
import { envSettings } from "./types";

const EnvSettingsManagerClass = new envSettingsManager();
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
  const saveEnv = document.getElementById("save_env") as HTMLButtonElement;
  saveEnv.addEventListener("click", handleSaveEnv);

  const addEnv = document.getElementById("add_env") as HTMLButtonElement;
  addEnv.addEventListener("click", addEnvSettingsRow);

  const csvUpload = document.getElementById("csv_upload") as HTMLInputElement;
  csvUpload.addEventListener("change", handleCsvUpload);
}

/**
 * Handles the upload of a CSV file.
 */
function handleCsvUpload() {
  const fileInput = document.getElementById("csv_upload") as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    Papa.parse(file, {
      header: true,
      complete: function (results) {
        const data = results.data as envSettings[];
        data.forEach((envSetting) => {
          addEnvSettingToTable(envSetting);
        });
      },
    });
  }
}

/**
 * Adds an environment setting to the table.
 * @param {envSettings} envSetting - The environment setting to add to the table.
 */
function addEnvSettingToTable(envSetting: envSettings) {
  const envSettingsTableBody = document.getElementById(
    "env_settings_table_body"
  ) as HTMLTableSectionElement;
  const envSettingsTableRow = document.createElement("tr");
  envSettingsTableRow.classList.add(
    "odd:bg-white",
    "even:bg-gray-50",
    "env_settings_form_data"
  );

  const projectNameCell = createTableCell(
    EnvSettingsManagerClass.trimHalfSpace(envSetting.projectName),
    "project_name",
    "required_text"
  );
  const envNameCell = createTableCell(
    EnvSettingsManagerClass.trimHalfSpace(envSetting.envName),
    "env_name",
    "required_text"
  );
  const envUrlCell = createTableCell(
    EnvSettingsManagerClass.trimHalfSpace(envSetting.envUrl),
    "env_url",
    "url"
  );
  const messageCell = createTableCell(envSetting.message, "message");
  const colorCell = createTableCell(envSetting.color, "color", "color");
  const labelCell = createTableCell(
    envSetting.labelPosition,
    "label",
    "labelPosition"
  );
  const activeFlagCell = activeFlagCheckbox(envSetting.activeFlag);
  const deleteCell = document.createElement("td");
  deleteCell.classList.add("border-t", "px-4", "py-2", "border-gray-200");

  const deleteButton = createDeleteButton();
  deleteButton.addEventListener("click", function () {
    deleteEnvSettingsRow(envSettingsTableRow.rowIndex);
  });

  deleteCell.appendChild(deleteButton);

  envSettingsTableRow.appendChild(projectNameCell);
  envSettingsTableRow.appendChild(envNameCell);
  envSettingsTableRow.appendChild(envUrlCell);
  envSettingsTableRow.appendChild(messageCell);
  envSettingsTableRow.appendChild(colorCell);
  envSettingsTableRow.appendChild(labelCell);
  envSettingsTableRow.appendChild(activeFlagCell);
  envSettingsTableRow.appendChild(deleteCell);

  envSettingsTableBody.appendChild(envSettingsTableRow);
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
    showValidationError(validateUrlResult, "env_url");
    alert(
      `${
        validateUrlResult + 1
      }行目のURLはhttp://またはhttpsから始まる必要があります。`
    );
    return;
  }

  if (validateDuplicateResult !== -1) {
    showValidationError(validateDuplicateResult, "env_url");
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
    createEnvSettingsTableList(envSettings);
  });
}

/**
 * create env settings table list
 * @param {Array} envSettings - env settings
 */
function createEnvSettingsTableList(envSettings: envSettings[]) {
  const envSettingsTable = document.getElementById(
    "env_settings_table"
  ) as HTMLTableElement;
  const envSettingsTableBody = document.createElement("tbody");
  envSettingsTableBody.id = "env_settings_table_body";

  // create table row
  envSettings.forEach((envSetting, index) => {
    const envSettingsTableRow = document.createElement("tr");
    envSettingsTableRow.classList.add(
      "odd:bg-white",
      "even:bg-gray-50",
      `env_${index}`,
      "env_settings_form_data"
    );

    // create table cell
    const projectNameCell = createTableCell(
      envSetting.projectName,
      "project_name",
      "required_text"
    );
    const envNameCell = createTableCell(
      envSetting.envName,
      "env_name",
      "required_text"
    );
    const envUrlCell = createTableCell(envSetting.envUrl, "env_url", "url");
    const messageCell = createTableCell(envSetting.message, "message");
    const colorCell = createTableCell(envSetting.color, "color", "color");
    const labelCell = createTableCell(
      envSetting.labelPosition,
      "label",
      "labelPosition"
    );
    const activeFlagCell = activeFlagCheckbox(envSetting.activeFlag);
    const deleteCell = document.createElement("td");
    deleteCell.classList.add("border-t", "px-4", "py-2", "border-gray-200");
    // add delete button
    const deleteButton = createDeleteButton();
    deleteButton.addEventListener("click", function () {
      deleteEnvSettingsRow(index);
    });

    // append delete button to table cell
    deleteCell.appendChild(deleteButton);

    // append table cell to table row
    envSettingsTableRow.appendChild(projectNameCell);
    envSettingsTableRow.appendChild(envNameCell);
    envSettingsTableRow.appendChild(envUrlCell);
    envSettingsTableRow.appendChild(messageCell);
    envSettingsTableRow.appendChild(colorCell);
    envSettingsTableRow.appendChild(labelCell);
    envSettingsTableRow.appendChild(activeFlagCell);
    envSettingsTableRow.appendChild(deleteCell);

    // append table row to table body
    envSettingsTableBody.appendChild(envSettingsTableRow);
  });

  envSettingsTable.appendChild(envSettingsTableBody);
}

/**
 * create table cell
 * @param {string} text - text
 * @param {string} className - class name
 * @param {string} type - input type
 * @return {HTMLTableCellElement} cell - table cell
 */
function createTableCell(
  text: string,
  className?: string,
  type: string = "text"
) {
  const cell = document.createElement("td");
  cell.classList.add("border-t", "px-4", "py-2", "border-gray-200");

  const inputElement = createInputElement(text, type);
  applyCommonStyles(inputElement, className);

  // add input element to td element
  cell.appendChild(inputElement);
  return cell;
}

/**
 * create input element based on type
 * @param {string} text - text
 * @param {string} type - input type
 * @return {HTMLInputElement | HTMLSelectElement} inputElement - input element
 */
function createInputElement(
  text: string,
  type: string
): HTMLInputElement | HTMLSelectElement {
  let inputElement: HTMLInputElement | HTMLSelectElement;

  switch (type) {
    case "required_text":
      inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.required = true;
      inputElement.value = text || "";
      break;
    case "color":
      inputElement = document.createElement("input");
      inputElement.type = "color";
      inputElement.value = text || "";
      break;
    case "url":
      inputElement = document.createElement("input");
      inputElement.type = "url";
      inputElement.placeholder = "https://example.com";
      inputElement.value = text || "";
      break;
    case "labelPosition":
      inputElement = document.createElement("select");
      inputElement.options.add(new Option("Bottom", "bottom"));
      inputElement.options.add(new Option("Top", "top"));
      inputElement.options.add(new Option("Right", "right"));
      inputElement.options.add(new Option("Left", "left"));
      inputElement.value = text || "";
      break;
    case "text":
    default:
      inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.value = text || "";
      break;
  }

  return inputElement;
}

/**
 * apply common styles to input element
 * @param {HTMLInputElement | HTMLSelectElement} inputElement - input element
 * @param {string} className - class name
 */
function applyCommonStyles(
  inputElement: HTMLInputElement | HTMLSelectElement,
  className?: string
) {
  inputElement.classList.add(
    `${className}`,
    "w-full",
    "appearance-none",
    "bg-transparent",
    "border",
    "border-solid",
    "border-gray-400",
    "rounded",
    "text-gray-700",
    "mr-3",
    "py-1",
    "px-2",
    "leading-tight",
    "focus:outline-none"
  );
}

/**
 * create delete button
 * @returns {HTMLButtonElement} deleteButton - delete button
 */
function createDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "bg-red-500",
    "hover:bg-red-700",
    "text-white",
    "font-bold",
    "py-1",
    "px-2",
    "rounded"
  );
  deleteButton.type = "button";
  deleteButton.innerText = "削除";
  return deleteButton;
}

/**
 * @param {boolean} activeFlag - active flag
 * @returns {HTMLInputElement} activeFlagCheckbox - active flag checkbox
 */
function activeFlagCheckbox(activeFlag?: boolean) {
  const activeFlagCell = document.createElement("td");
  activeFlagCell.classList.add(
    "border-t",
    "px-4",
    "py-2",
    "border-gray-200",
    "flex",
    "items-center",
    "justify-center"
  );
  const activeFlagCheckbox = document.createElement("input");
  activeFlagCheckbox.type = "checkbox";
  activeFlagCheckbox.checked = activeFlag || false;
  activeFlagCheckbox.classList.add("active_flag");
  activeFlagCell.appendChild(activeFlagCheckbox);
  return activeFlagCell;
}

/**
 * add env settings row
 */
function addEnvSettingsRow() {
  const envSettingsTableBody = document.getElementById(
    "env_settings_table_body"
  ) as HTMLTableSectionElement;
  const envSettingsTableRow = document.createElement("tr");
  envSettingsTableRow.classList.add(
    "odd:bg-white",
    "even:bg-gray-50",
    "env_settings_form_data"
  );

  // create table cell
  const projectNameCell = createTableCell("", "project_name");
  const envNameCell = createTableCell("", "env_name");
  const envUrlCell = createTableCell("", "env_url", "url");
  const messageCell = createTableCell("", "message");
  const colorCell = createTableCell("", "color", "color");
  const labelCell = createTableCell("", "label", "labelPosition");
  const activeFlagCell = activeFlagCheckbox();
  // append table cell to table row
  envSettingsTableRow.appendChild(projectNameCell);
  envSettingsTableRow.appendChild(envNameCell);
  envSettingsTableRow.appendChild(envUrlCell);
  envSettingsTableRow.appendChild(messageCell);
  envSettingsTableRow.appendChild(colorCell);
  envSettingsTableRow.appendChild(labelCell);
  envSettingsTableRow.appendChild(activeFlagCell);

  // append table row to table body
  envSettingsTableBody.appendChild(envSettingsTableRow);
}

/**
 * delete env settings row
 * @param {number} row_id - row id
 */
function deleteEnvSettingsRow(row_id: number) {
  const envSettingsTableBody = document.getElementById(
    "env_settings_table_body"
  ) as HTMLTableSectionElement;
  const envSettingsTableRow = document.getElementsByClassName(
    `env_${row_id}`
  )[0] as HTMLTableRowElement;

  envSettingsTableBody.removeChild(envSettingsTableRow);
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
