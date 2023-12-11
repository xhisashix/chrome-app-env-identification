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
    OptionClass.saveToStorageEnvSettings([getFormData()]);
  });
}

// get env settings from storage
function getEnvSettings() {
  OptionClass.getStorageEnvSettings(function (result: string) {
    const envSettings = OptionClass.getEnvSettings(result);
    createEnvSettingsTableList(envSettings);
  });
}

// get form data
function getFormData() {
  const envName = (document.getElementById("env_name") as HTMLInputElement)
    .value;
  const envUrl = (document.getElementById("env_url") as HTMLInputElement).value;
  const message = (document.getElementById("message") as HTMLInputElement)
    .value;
  const envSettings: envSettings = {
    envName: envName,
    envUrl: envUrl,
    message: message,
  };
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
  envSettings.forEach((envSetting) => {
    const envSettingsTableRow = document.createElement("tr");
    envSettingsTableRow.id = "env_settings_table_row";

    // create table cell
    const envNameCell = createTableCell(envSetting.envName);
    const envUrlCell = createTableCell(envSetting.envUrl);
    const messageCell = createTableCell(envSetting.message);

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
function createTableCell(text: string) {
  const cell = document.createElement("td");
  cell.classList.add("border", "px-4", "py-2");
  cell.textContent = text;
  return cell;
}

init();
