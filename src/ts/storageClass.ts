class storageClass {
  /**
   * @param {string} key - Key to save settings under
   * @param {string} value - Value to save settings under
   * @return {void}
   */
  saveToStorage(key: string, value: string) {
    chrome.storage.local.set({ [key]: value }),
      () => {
        console.log("Value is set to " + value);
      };
  }

  /**
   * @param {string} key - Key to get settings under
   * @param {strung} value - Value to get settings under
   * @return {void}
   */
  getStorage(key: string, callback: (result: string) => void) {
    chrome.storage.local.get([key], (result) => {
      callback(result[key]);
    });
  }

  /**
   * 非同期にストレージからデータを取得する。
   * @param {string} key - 取得するデータのキー。
   * @return {Promise<string>} - 指定されたキーに対応するデータを含むプロミス。
   */
  getStorageAsync(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], (result) => {
        if (chrome.runtime.lastError) {
          // ストレージの読み取り中にエラーが発生した場合
          reject(chrome.runtime.lastError);
        } else {
          // 成功した場合、キーに対応する値を解決する
          resolve(result[key]);
        }
      });
    });
  }
}

export default storageClass;
