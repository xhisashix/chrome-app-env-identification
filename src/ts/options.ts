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
  // const saveEnv = document.getElementById("save_env") as HTMLButtonElement;
  // saveEnv.addEventListener("click", function () {
  //   OptionClass.saveToStorageEnvSettings([getFormData()]);
  //   resetFormData();
  // });
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

// reset form data
function resetFormData() {
  (document.getElementById("env_name") as HTMLInputElement).value = "";
  (document.getElementById("env_url") as HTMLInputElement).value = "";
  (document.getElementById("message") as HTMLInputElement).value = "";
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
    envSettingsTableRow.classList.add("odd:bg-white", "even:bg-gray-50");

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
  cell.classList.add("border-t", "px-4", "py-2", "border-gray-200");
  // add input element
  const input = document.createElement("input");
  input.type = "text";
  input.classList.add(
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

init();
