chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.envSettings) {
    const envSettings = request.envSettings;

    const envName = envSettings.envName || "";
    const envUrl = envSettings.envUrl;
    const message = envSettings.message || "備考なし";
    const color = envSettings.color || "red";
    applyTestEnvironmentIndicator(envName, message, color);
  }
});

function applyTestEnvironmentIndicator(envName: string, message: string, color: string): void {
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = `
    body::after {
      content: "${envName} : ${message}";
      position: fixed;
      width: 100vw;
      top: auto;
      bottom: 0;
      left: 0;
      padding: 10px;
      background-color: ${colorSelector(color)};
      color: white;
      font-weight: bold;
      font-size: 36px;
      z-index: 999999;
    }
  `;
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
    default:
      return "rgba(255, 0, 0, 0.7)";
  }
}