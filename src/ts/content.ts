chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.envSettings) {
    console.log("Received envSettings: ", request.envSettings);
    const envSettings = request.envSettings;

    const envName = envSettings.envName || "";
    const envUrl = envSettings.envUrl;
    const message = envSettings.message || "備考なし";
    applyTestEnvironmentIndicator(envName, message);
  }
});

function applyTestEnvironmentIndicator(envName: string, message: string): void {
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
      background-color: rgba(255, 0, 0, 0.7);
      color: white;
      font-weight: bold;
      font-size: 36px;
      z-index: 999999;
    }
  `;
  document.head.appendChild(style);
}