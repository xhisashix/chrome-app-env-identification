import Storage from "./storageClass";

interface envSettings {
  envName: string;
  envUrl: string;
  message: string;
  color: string;
}

chrome.action.onClicked.addListener(function () {
  chrome.runtime.openOptionsPage();
});

const storage = new Storage();

// tabがアクティブになった時のイベント
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      getEnvSettings(tabs[0].url as string);
    });
  });
});

// get env settings from storage
async function getEnvSettings(currentTabUrl: string) {
  await storage.getStorage("env_settings", function (result: string) {
    const envSettings = getEnvSettingsArray(result);
    const tabUrl = currentTabUrl;
    const envUrl = getEnvUrl(envSettings, tabUrl);
    const envSetting = getEnv(envSettings, tabUrl);
    if (envUrl) {
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#4688F1" });

      // 背景色を変更するためのコンテンツスクリプトを実行
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0]?.id || 0;
        chrome.scripting.executeScript({
          target: { tabId },
          files: ["/js/content.js"],
        });
        chrome.tabs.sendMessage(tabId, { envSettings: envSetting });
      });
    } else {
      chrome.action.setBadgeText({ text: "OFF" });
      chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
    }
  });
}

// get env url
function getEnvUrl(envSettings: envSettings[], tabUrl: string): string {
  let envUrl = "";
  for (let i = 0; i < envSettings.length; i++) {
    if (checkIncludeUrl(envSettings[i].envUrl, tabUrl)) {
      envUrl = envSettings[i].envUrl;
      break;
    }
  }
  return envUrl;
}

function getEnv(envSettings: envSettings[], tabUrl: string): envSettings {
  let envSetting = {} as envSettings;
  for (let i = 0; i < envSettings.length; i++) {
    if (checkIncludeUrl(envSettings[i].envUrl, tabUrl)) {
      envSetting = envSettings[i];
      break;
    }
  }
  return envSetting;
}

// get env settings from storage
function getEnvSettingsArray(result: string): envSettings[] {
  if (result) {
    return JSON.parse(result);
  } else {
    return [];
  }
}

// check include env url
function checkIncludeUrl(envUrl: string, tabUrl: string) {
  if (tabUrl === undefined) {
    return false;
  }
  return tabUrl.includes(envUrl);
}

// ページの背景を変更する
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      getEnvSettings(tabs[0].url as string);
    });
  }
});

// ページの背景を変更するelementを作成する
function createChangeBackgroundElement() {
  const changeBackgroundElement = document.createElement("div");
  changeBackgroundElement.setAttribute("id", "change_background");
  changeBackgroundElement.setAttribute("style", "background-color: red;");
  document.body.appendChild(changeBackgroundElement);
}
