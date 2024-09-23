import React from "react";
// import "../tailwind.css";
import { TbCapture } from "react-icons/tb";
import { IoIosVideocam } from "react-icons/io";

const handleOperation = (type: string) => {
  switch (type) {
    case "take_screenshot":
      takeScreenshot();
      break;
    case "record_video":
      recordVideo();
      break;
    default:
      break;
  }
};

const recordVideo = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  chrome.tabs.sendMessage(tab.id || 0, { type: "record_video" });
};

const takeScreenshot = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  chrome.tabs.sendMessage(tab.id || 0, { type: "take_screenshot" });
};

const Home = () => {
  return (
    <div className=" w-full flex flex-col items-start">
      <button
        onClick={() => handleOperation("take_screenshot")}
        className=" flex w-full flex-row items-center justify-center py-2 px-4 gap-x-2 border-[1px] rounded-full border-red-400"
      >
        <TbCapture className=" text-gray-800 text-xl" />
        <p className=" text-red-300 text-sm">Capture screenshot</p>
      </button>

      <button
        onClick={() => handleOperation("record_video")}
        className=" flex w-full flex-row items-center justify-center py-2 px-4 gap-x-2 border-[1px] rounded-full border-red-400"
      >
        <IoIosVideocam className=" text-gray-800 text-xl" />
        <p className=" text-red-300 text-sm">Record Video</p>
      </button>
    </div>
  );
};

export default Home;
