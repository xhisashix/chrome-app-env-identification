import optionClass from "./optionClass";

const OptionClass = new optionClass();

interface envSettings {
  envName: string;
  envUrl: string;
  message: string;
}

function init() {
  setupEventHandlers();
  getEnvSettings();
}

// event handlers setting
function setupEventHandlers() {
  const saveEnv = document.getElementById("save_env") as HTMLButtonElement;
  saveEnv.addEventListener("click", function () {
    const envSettings = getAllFormData();
    console.log(envSettings);
    OptionClass.saveToStorageEnvSettings(envSettings);
  });

  const addEnv = document.getElementById("add_env") as HTMLButtonElement;
  addEnv.addEventListener("click", function () {
    addEnvSettingsRow();
  });
}

// get env settings from storage
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
    envSettings.push({
      envName: envName,
      envUrl: envUrl,
      message: message,
    });
  }
  return envSettings;
}

// create env settings table in options page
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
    const envNameCell = createTableCell(envSetting.envName, "env_name");
    const envUrlCell = createTableCell(envSetting.envUrl, "env_url");
    const messageCell = createTableCell(envSetting.message, "message");

    // append table cell to table row
    envSettingsTableRow.appendChild(envNameCell);
    envSettingsTableRow.appendChild(envUrlCell);
    envSettingsTableRow.appendChild(messageCell);

    // append table row to table body
    envSettingsTableBody.appendChild(envSettingsTableRow);
  });

  envSettingsTable.appendChild(envSettingsTableBody);
}

// create td element for env settings table
function createTableCell(text: string, className?: string) {
  const cell = document.createElement("td");
  cell.classList.add("border-t", "px-4", "py-2", "border-gray-200");
  // add input element
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add(
    `${className}`,
    "w-full",
    "appearance-none",
    "bg-transparent",
    "border",
    "border-solid",
    "border-gray-400",
    "text-gray-700",
    "mr-3",
    "py-1",
    "px-2",
    "leading-tight",
    "focus:outline-none"
  );
  input.value = text;

  // add input element to td element
  cell.appendChild(input);
  return cell;
}

// add env settings row
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
  const envNameCell = createTableCell("", "env_name");
  const envUrlCell = createTableCell("", "env_url");
  const messageCell = createTableCell("", "message");

  // append table cell to table row
  envSettingsTableRow.appendChild(envNameCell);
  envSettingsTableRow.appendChild(envUrlCell);
  envSettingsTableRow.appendChild(messageCell);

  // append table row to table body
  envSettingsTableBody.appendChild(envSettingsTableRow);
}

init();
