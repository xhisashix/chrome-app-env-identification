const DEFAULT_PROJECT_NAME = "";
const DEFAULT_ENV_NAME = "";
const DEFAULT_MESSAGE = "備考なし";
const DEFAULT_COLOR = "red";
const DEFAULT_LABEL_POSITION = "bottom";
const DEFAULT_ACTIVE_FLAG = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.envSettings) {
    const envSettings = request.envSettings;
    const projectName = envSettings.projectName || DEFAULT_PROJECT_NAME;
    const envName = envSettings.envName || DEFAULT_ENV_NAME;
    const message = envSettings.message || DEFAULT_MESSAGE;
    const color = envSettings.color || DEFAULT_COLOR;
    const labelPosition = envSettings.labelPosition || DEFAULT_LABEL_POSITION;
    const activeFlag = envSettings.activeFlag || DEFAULT_ACTIVE_FLAG;

    if (!activeFlag) {
      return;
    }

    removeExistingLabel();
    applyTestEnvironmentIndicator(
      projectName,
      envName,
      message,
      color,
      labelPosition
    );
  }
});

/**
 * 既存のラベルを削除する
 */
function removeExistingLabel() {
  const existingLabel = document.getElementById("test-environment-indicator");
  if (existingLabel) {
    existingLabel.remove();
  }
}

/**
 * applyTestEnvironmentIndicator - テスト環境のラベルを適用する
 * @param projectName - プロジェクト名
 * @param envName - 環境名
 * @param message - メッセージ
 * @param color - 背景色
 * @param labelPosition - ラベルの位置
 */
function applyTestEnvironmentIndicator(
  projectName: string,
  envName: string,
  message: string,
  color: string,
  labelPosition: string
): void {
  removeExistingLabel();

  const messageDiv = document.createElement("div");
  messageDiv.id = "test-environment-indicator";
  messageDiv.innerHTML = `【${projectName}】${envName} : ${message}`;
  const style = document.createElement("style");
  const labelPositionStyle = createLabelPosition(labelPosition);
  style.innerHTML = `
    #test-environment-indicator {
      position: fixed;
      width: 100vw;
      margin: auto;
      ${labelPositionStyle}
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
