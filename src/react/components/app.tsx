import React from "react";

const takeScreenshot = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("activeTab", tabs);
  const tab = tabs[0];
  chrome.tabs.sendMessage(tab.id || 0, { type: "TAKE_SCREENSHOT" });
};

const App = () => {
  return (
    <div>
      <a
        onClick={() => {
          takeScreenshot();
        }}
        style={{ color: "blue", cursor: "pointer" }}
      >
        Click Screnshot
      </a>
    </div>
  );
};

export default App;
