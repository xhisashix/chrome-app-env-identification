chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.envSettings) {
    const envSettings = request.envSettings;

    const projectName = envSettings.projectName || "";
    const envName = envSettings.envName || "";
    const envUrl = envSettings.envUrl;
    const message = envSettings.message || "備考なし";
    const color = envSettings.color || "red";
    applyTestEnvironmentIndicator(projectName, envName, message, color);
  }
});

function applyTestEnvironmentIndicator(
  projectName: string,
  envName: string,
  message: string,
  color: string
): void {
  const messageDiv = document.createElement("div");
  messageDiv.id = "test-environment-indicator";
  messageDiv.innerHTML = `【${projectName}】${envName} : ${message}`;
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = `
    #test-environment-indicator {
      position: fixed;
      width: 100vw;
      top: auto;
      bottom: 0;
      left: 0;
      padding: 10px;
      background-color: ${colorSelector(color)};
      color: white;
      font-size: 36px;
      z-index: 999999;
    }
  `;
  document.body.appendChild(messageDiv);
  document.head.appendChild(style);
}

function colorSelector(color: string): string {
  switch (color) {
    case "red":
      return "rgba(255, 0, 0, 0.7)";
    case "blue":
      return "rgba(0, 0, 255, 0.7)";
    case "green":
      return "rgba(0, 255, 0, 0.7)";
    case "yellow":
      return "rgba(255, 255, 0, 0.7)";
    case "gray":
      return "rgba(128, 128, 128, 0.7)";
    default:
      return "rgba(255, 0, 0, 0.7)";
  }
}
