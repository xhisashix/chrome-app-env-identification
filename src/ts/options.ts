import optionClass from "./optionClass";

const OptionClass = new optionClass();

interface envSettings {
  projectName: string;
  envName: string;
  envUrl: string;
  message: string;
  color: string;
  labelPosition: string;
  activeFlag: boolean;
}

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
}

/**
 * save env settings
 */
function handleSaveEnv() {
  const envSettings = getAllFormData();
  const validateResult = OptionClass.validateHttpOrHttps(envSettings);

  if (validateResult !== -1) {
    showValidationError(validateResult);
    return;
  }

  console.log(envSettings);
  OptionClass.saveToStorageEnvSettings(envSettings);
  flashMessage();
}

/**
 * validate http or https
 * @param {number} validateResult - validate result
 */
function showValidationError(validateResult: number) {
  // return error message
  alert(
    `${
      validateResult + 1
    }行目のURLはhttp://またはhttpsから始まる必要があります。`
  );

  // Add focus to the input element of the line that caused the error
  const envSettingsTableBody = document.getElementById(
    "env_settings_table_body"
  ) as HTMLTableSectionElement;
  const envSettingsTableRows = envSettingsTableBody.getElementsByClassName(
    "env_settings_form_data"
  );

  const errorRow = envSettingsTableRows[validateResult] as HTMLTableRowElement;
  const errorInput = errorRow.getElementsByClassName(
    "env_url"
  )[0] as HTMLInputElement;
  errorInput.classList.add("border-red-500");
  errorInput.focus();
}

/**
 * get env settings from storage
 * @return {Array} envSettings - env settings
 * @return {void}
 */
function getEnvSettings() {
  OptionClass.getStorageEnvSettings(function (result: string) {
    const envSettings = OptionClass.getEnvSettings(result);
    createEnvSettingsTableList(envSettings);
  });
}

/**
 * get form all data
 * @return {Array} envSettings - env settings
 */
function getAllFormData() {
  const envSettingsTableBody = document.getElementById(
    "env_settings_table_body"
  ) as HTMLTableSectionElement;
  const envSettingsTableRows = envSettingsTableBody.getElementsByClassName(
    "env_settings_form_data"
  );
  const envSettings: envSettings[] = [];
  // tr要素の数だけループ
  for (let i = 0; i < envSettingsTableRows.length; i++) {
    const envSettingsTableRow = envSettingsTableRows[i] as HTMLTableRowElement;
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
      envSettingsTableRow.getElementsByClassName("color")[0] as HTMLInputElement
    ).value;
    const labelPosition = (
      envSettingsTableRow.getElementsByClassName("label")[0] as HTMLInputElement
    ).value;
    const activeFlag = (
      envSettingsTableRow.getElementsByClassName(
        "active_flag"
      )[0] as HTMLInputElement
    ).checked;
    envSettings.push({
      projectName: projectName,
      envName: envName,
      envUrl: envUrl,
      message: message,
      color: color,
      labelPosition: labelPosition,
      activeFlag: activeFlag,
    });
  }
  return envSettings;
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
      "project_name"
    );
    const envNameCell = createTableCell(envSetting.envName, "env_name");
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

  let inputElement: HTMLInputElement | HTMLSelectElement =
    document.createElement("input");
  if (type === "text") {
    inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = text || "";
  }

  if (type === "color") {
    inputElement = document.createElement("input");
    inputElement.type = "color";

    if (text) {
      inputElement.value = text;
    }
  }

  if (type === "url") {
    inputElement = document.createElement("input");
    inputElement.type = "url";
    inputElement.placeholder = "https://example.com";
    inputElement.value = text;
  }

  if (type === "labelPosition") {
    inputElement = document.createElement("select");
    inputElement.options.add(new Option("Bottom", "bottom"));
    inputElement.options.add(new Option("Top", "top"));
    inputElement.options.add(new Option("Right", "right"));
    inputElement.options.add(new Option("Left", "left"));
    inputElement.value = text;
  }

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
  // add input element to td element
  cell.appendChild(inputElement);
  return cell;
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
