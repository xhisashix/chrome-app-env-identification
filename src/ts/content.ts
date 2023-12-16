function applyTestEnvironmentIndicator(): void {
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = `
    body::after {
      content: "Test Environment";
      position: fixed;
      top: auto;
      bottom: 0;
      left: 0;
      padding: 5px;
      background-color: rgba(255, 0, 0, 0.7);
      color: white;
      font-weight: bold;
      font-size: 36px;
      z-index: 999999;
    }
  `;
  document.head.appendChild(style);
}

// 関数を呼び出して、スタイルを適用する
applyTestEnvironmentIndicator();


console.log("content.js");
