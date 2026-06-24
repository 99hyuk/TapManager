(function () {
  "use strict";

  const openBoard = document.getElementById("openBoard");
  let didOpen = false;

  async function openBoardTab() {
    if (didOpen) {
      return;
    }
    didOpen = true;

    if (typeof chrome === "undefined" || !chrome.tabs || !chrome.runtime) {
      window.open("newtab.html", "_blank", "noopener,noreferrer");
      return;
    }

    await chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });
    window.close();
  }

  openBoard.addEventListener("click", openBoardTab);
  queueMicrotask(openBoardTab);
})();
