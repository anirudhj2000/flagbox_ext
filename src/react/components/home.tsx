import React from "react";
// import "../tailwind.css";
import { TbCapture } from "react-icons/tb";

const takeScreenshot = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  chrome.tabs.sendMessage(tab.id || 0, { type: "TAKE_SCREENSHOT" });
};

const Home = () => {
  return (
    <div className=" w-full flex flex-col items-start">
      <button
        onClick={takeScreenshot}
        className=" flex w-full flex-row items-center justify-center py-2 px-4 gap-x-2 border-[1px] rounded-full border-red-400"
      >
        <TbCapture className=" text-gray-800 text-xl" />
        <p className=" text-red-300 text-sm">Capture Screenshot</p>
      </button>
    </div>
  );
};

export default Home;
