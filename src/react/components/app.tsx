import React from "react";

const takeScreenshot = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("activeTab", tabs);
  const tab = tabs[0];
  chrome.tabs.sendMessage(tab.id || 0, { type: "TAKE_SCREENSHOT" });
};

const App = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
        height: 300,
        width: 300,
        border: "1px solid black",
        backgroundColor: "#ffa396",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid black",
          backgroundColor: "#ff6f61",
        }}
      >
        <p style={{ fontSize: 24, fontWeight: "bold" }}>Flagbox</p>
      </div>

      <div
        style={{
          width: "100%",
          padding: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={takeScreenshot}
          style={{
            padding: 8,
            backgroundColor: "#ff6f61",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Take Screenshot
        </button>
      </div>
    </div>
  );
};

export default App;
