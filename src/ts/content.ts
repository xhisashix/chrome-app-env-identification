chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.envSettings) {
    const envSettings = request.envSettings;

    const projectName = envSettings.projectName || "";
    const envName = envSettings.envName || "";
    const message = envSettings.message || "備考なし";
    const color = envSettings.color || "red";
    const labelPosition = createLabelPosition(
      envSettings.labelPosition || "button"
    );
    const activeFlag = envSettings.activeFlag || false;
    if (!activeFlag) {
      return;
    }
    // 既存のラベルを削除
    const existingLabel = document.getElementById("test-environment-indicator");
    if (existingLabel) {
      existingLabel.remove();
    }

    applyTestEnvironmentIndicator(
      projectName,
      envName,
      message,
      color,
      labelPosition
    );
  }
});

function applyTestEnvironmentIndicator(
  projectName: string,
  envName: string,
  message: string,
  color: string,
  labelPosition: string
): void {
  const messageDiv = document.createElement("div");
  messageDiv.id = "test-environment-indicator";
  messageDiv.innerHTML = `【${projectName}】${envName} : ${message}`;
  const style = document.createElement("style");
  style.innerHTML = `
    #test-environment-indicator {
      position: fixed;
      width: 100vw;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      ${labelPosition}
      padding: 10px;
      background-color: ${color};
      color: white;
      opacity: 0.8;
      font-size: 36px;
      z-index: 999999;
    }
  `;
  document.body.appendChild(messageDiv);
  document.head.appendChild(style);
}

/**
 * labelPosition - ラベルの位置を設定する
 * @param {string} labelPosition - ラベルの位置
 * @return {string} - style
 */
function createLabelPosition(labelPosition: string): string {
  let labelStyle = "";
  const leftRightStyle = `height: 100vh; width: 50px; writing-mode: vertical-rl;`;
  if (labelPosition === "top") {
    labelStyle = `top: 0; bottom: auto;`;
  }
  if (labelPosition === "bottom") {
    labelStyle = `top: auto; bottom: 0;`;
  }

  if (labelPosition === "left") {
    labelStyle = `left: 0; right: auto; ${leftRightStyle}`;
  }

  if (labelPosition === "right") {
    labelStyle = `left: auto; right: 0; ${leftRightStyle}`;
  }
  return labelStyle;
}
