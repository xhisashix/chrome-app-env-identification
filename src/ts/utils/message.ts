class Message {
  /**
   * flash message
   */
  public flashMessage() {
    const flashMessage = document.getElementById(
      "flash_message"
    ) as HTMLElement;
    flashMessage.classList.remove("hidden");
    setTimeout(function () {
      flashMessage.classList.add("hidden");
    }, 2000);
  }

  /**
   * Displays a validation error message for an invalid URL.
   * @param {number} validateResult - The index of the row with the invalid URL.
   * @param {string} target - The target element to which the error message should be displayed.
   */
  public showValidationError(validateResult: number, target: string) {
    // Add focus to the input element of the line that caused the error
    const envSettingsTableBody = document.getElementById(
      "env_settings_table_body"
    ) as HTMLTableSectionElement;
    const envSettingsTableRows = envSettingsTableBody.getElementsByClassName(
      "env_settings_form_data"
    );

    const errorRow = envSettingsTableRows[
      validateResult
    ] as HTMLTableRowElement;
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
}

export default Message;
