import React from "react";

const takeScreenshot = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  chrome.tabs.sendMessage(tab.id || 0, { type: "TAKE_SCREENSHOT" });
};

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <button
          onClick={takeScreenshot}
          style={{
            color: "#fc5151",
            cursor: "pointer",
            border: "solid 1px #fc5151",
            borderRadius: 8,
            padding: 4,
            backgroundColor: "transparent",
          }}
        >
          Capture Screenshot
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <button
          onClick={() => {
            // logic to navigate to the dashboard
          }}
          style={{
            color: "#fc5151",
            cursor: "pointer",
            border: "solid 1px #fc5151",
            borderRadius: 8,
            padding: 4,
            backgroundColor: "transparent",
          }}
        >
          Visit Dashboard
        </button>
      </div>
    </div>
  );
};

export default Home;
