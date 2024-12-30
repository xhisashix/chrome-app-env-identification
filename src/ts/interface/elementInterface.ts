interface DomElements {
  projectName: string;
  envName: string;
  envUrl: string;
  message: string;
  color: string;
  label: string;
  activeFlag: string;
  saveButton: string;
  deleteButton: string;
  cancelButton: string;
  envList: string;
  envListContainer: string;
  addEnv: string;
  csvUpload: string;
}

const DomElements: DomElements = {
  projectName: "project_name",
  envName: "env_name",
  envUrl: "env_url",
  message: "message",
  color: "color",
  label: "label",
  activeFlag: "active_flag",
  saveButton: "save_env",
  deleteButton: "delete_env",
  cancelButton: "cancel_env",
  envList: "env_list",
  envListContainer: "env_list_container",
  addEnv: "add_env",
  csvUpload: "csv_upload",
};

export { DomElements };