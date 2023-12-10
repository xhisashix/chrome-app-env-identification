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
    console.log("saveEnv");
    OptionClass.saveToStorageEnvSettings(JSON.stringify(getFormData()));
  });
}

// get env settings from storage
function getEnvSettings() {
  OptionClass.getStorageEnvSettings(function (result: string) {
    console.log(result);
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

init();
