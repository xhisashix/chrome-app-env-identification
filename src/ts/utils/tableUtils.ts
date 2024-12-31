import { DomElements } from "../interface/elementInterface";
import { envSettings } from "../interface/types";
import envSettingsManager from "./envSettingsManager";

const EnvSettingsManagerClass = new envSettingsManager();

class tableUtils {
  /**
   * Adds an environment setting to the table.
   * @param {envSettings} envSetting - The environment setting to add to the table.
   */
  public addEnvSettingToTable(envSetting: envSettings) {
    const envSettingsTableBody = document.getElementById(
      "env_settings_table_body"
    ) as HTMLTableSectionElement;
    const envSettingsTableRow = document.createElement("tr");
    envSettingsTableRow.classList.add(
      "odd:bg-white",
      "even:bg-gray-50",
      "env_settings_form_data"
    );

    const projectNameCell = this.createTableCell(
      EnvSettingsManagerClass.trimHalfSpace(envSetting.projectName),
      DomElements.projectName,
      "required_text"
    );
    const envNameCell = this.createTableCell(
      EnvSettingsManagerClass.trimHalfSpace(envSetting.envName),
      DomElements.envName,
      "required_text"
    );
    const envUrlCell = this.createTableCell(
      EnvSettingsManagerClass.trimHalfSpace(envSetting.envUrl),
      DomElements.envUrl,
      "url"
    );
    const messageCell = this.createTableCell(
      envSetting.message,
      DomElements.message
    );
    const colorCell = this.createTableCell(
      envSetting.color,
      DomElements.color,
      DomElements.color
    );
    const labelCell = this.createTableCell(
      envSetting.labelPosition,
      "label",
      "labelPosition"
    );
    const activeFlagCell = this.activeFlagCheckbox(envSetting.activeFlag);
    const deleteCell = document.createElement("td");
    deleteCell.classList.add("border-t", "px-4", "py-2", "border-gray-200");

    const deleteButton = this.createDeleteButton();
    deleteButton.addEventListener("click", () => {
      this.deleteEnvSettingsRow(envSettingsTableRow.rowIndex);
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
   * create table cell
   * @param {string} text - text
   * @param {string} className - class name
   * @param {string} type - input type
   * @return {HTMLTableCellElement} cell - table cell
   */
  protected createTableCell(
    text: string,
    className?: string,
    type: string = "text"
  ) {
    const cell = document.createElement("td");
    cell.classList.add("border-t", "px-4", "py-2", "border-gray-200");

    const inputElement = this.createInputElement(text, type);
    this.applyCommonStyles(inputElement, className);

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
  protected createInputElement(
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
      case DomElements.color:
        inputElement = document.createElement("input");
        inputElement.type = DomElements.color;
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
  protected applyCommonStyles(
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
  protected createDeleteButton() {
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
  protected activeFlagCheckbox(activeFlag?: boolean) {
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
    activeFlagCheckbox.classList.add(DomElements.activeFlag);
    activeFlagCell.appendChild(activeFlagCheckbox);
    return activeFlagCell;
  }

  /**
   * add env settings row
   */
  public addEnvSettingsRow = () => {
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
    const projectNameCell = this.createTableCell("", DomElements.projectName);
    const envNameCell = this.createTableCell("", DomElements.envName);
    const envUrlCell = this.createTableCell("", DomElements.envUrl, "url");
    const messageCell = this.createTableCell("", DomElements.message);
    const colorCell = this.createTableCell(
      "",
      DomElements.color,
      DomElements.color
    );
    const labelCell = this.createTableCell("", "label", "labelPosition");
    const activeFlagCell = this.activeFlagCheckbox();
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
  };

  /**
   * delete env settings row
   * @param {number} row_id - row id
   */
  protected deleteEnvSettingsRow(row_id: number) {
    const envSettingsTableBody = document.getElementById(
      "env_settings_table_body"
    ) as HTMLTableSectionElement;
    const envSettingsTableRow = document.getElementsByClassName(
      `env_${row_id}`
    )[0] as HTMLTableRowElement;

    envSettingsTableBody.removeChild(envSettingsTableRow);
  }

  /**
   * create env settings table list
   * @param {Array} envSettings - env settings
   */
  public createEnvSettingsTableList(envSettings: envSettings[]) {
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
      const projectNameCell = this.createTableCell(
        envSetting.projectName,
        DomElements.projectName,
        "required_text"
      );
      const envNameCell = this.createTableCell(
        envSetting.envName,
        DomElements.envName,
        "required_text"
      );
      const envUrlCell = this.createTableCell(
        envSetting.envUrl,
        DomElements.envUrl,
        "url"
      );
      const messageCell = this.createTableCell(
        envSetting.message,
        DomElements.message
      );
      const colorCell = this.createTableCell(
        envSetting.color,
        DomElements.color,
        DomElements.color
      );
      const labelCell = this.createTableCell(
        envSetting.labelPosition,
        "label",
        "labelPosition"
      );
      const activeFlagCell = this.activeFlagCheckbox(envSetting.activeFlag);
      const deleteCell = document.createElement("td");
      deleteCell.classList.add("border-t", "px-4", "py-2", "border-gray-200");
      // add delete button
      const deleteButton = this.createDeleteButton();
      deleteButton.addEventListener("click", () => {
        this.deleteEnvSettingsRow(index);
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
}

export default tableUtils;
