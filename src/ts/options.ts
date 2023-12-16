import optionClass from "./optionClass";

const OptionClass = new optionClass();

interface envSettings {
  envName: string;
  envUrl: string;
  message: string;
  color: string;
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
    flashMessage();
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
    const color = (
      envSettingsTableRow.getElementsByClassName("color")[0] as HTMLInputElement
    ).value;
    envSettings.push({
      envName: envName,
      envUrl: envUrl,
      message: message,
      color: color,
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
    const colorCell = createColorCell(envSetting.color);
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
    envSettingsTableRow.appendChild(envNameCell);
    envSettingsTableRow.appendChild(envUrlCell);
    envSettingsTableRow.appendChild(messageCell);
    envSettingsTableRow.appendChild(colorCell);
    envSettingsTableRow.appendChild(deleteCell);

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
    "rounded",
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

// create td element for select color
function createColorCell(value?: string) {
  const cell = document.createElement("td");
  cell.classList.add("border-t", "px-4", "py-2", "border-gray-200");
  // add input element
  const select = document.createElement("select");
  select.classList.add(
    "color",
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

  select.options.add(new Option("red", "red"));
  select.options.add(new Option("blue", "blue"));
  select.options.add(new Option("green", "green"));
  select.options.add(new Option("yellow", "yellow"));
  select.options.add(new Option("gray", "gray"));

  if (value) {
    select.value = value;
  }
  // add input element to td element
  cell.appendChild(select);
  return cell;
}

// create button element for env settings table
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
  deleteButton.innerText = "Delete";
  return deleteButton;
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
  const colorCell = createTableCell("", "color");

  // append table cell to table row
  envSettingsTableRow.appendChild(envNameCell);
  envSettingsTableRow.appendChild(envUrlCell);
  envSettingsTableRow.appendChild(messageCell);
  envSettingsTableRow.appendChild(colorCell);

  // append table row to table body
  envSettingsTableBody.appendChild(envSettingsTableRow);
}

// delete env settings row
function deleteEnvSettingsRow(row_id: number) {
  const envSettingsTableBody = document.getElementById(
    "env_settings_table_body"
  ) as HTMLTableSectionElement;
  const envSettingsTableRow = document.getElementsByClassName(
    `env_${row_id}`
  )[0] as HTMLTableRowElement;

  envSettingsTableBody.removeChild(envSettingsTableRow);
}

// flash message for save env settings
function flashMessage() {
  const flashMessage = document.getElementById("flash_message") as HTMLElement;
  flashMessage.classList.remove("hidden");
  setTimeout(function () {
    flashMessage.classList.add("hidden");
  }, 2000);
}

init();
