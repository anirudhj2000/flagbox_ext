import React, { useEffect, useState, useRef } from "react";
// import "../tailwind.css";
import { TbCapture } from "react-icons/tb";
import { IoIosVideocam } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";

const handleOperation = (type: string, section?: string) => {
  switch (type) {
    case "take_screenshot":
      if (section) takeScreenshot(section);
      break;
    case "record_video":
      recordVideo();
      break;
    default:
      break;
  }
};

const takeScreenshot = async (section: string) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  chrome.tabs.sendMessage(tab.id || 0, {
    type: "take_screenshot",
    subtype: section,
  });
};

const recordVideo = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  chrome.tabs.sendMessage(tab.id || 0, { type: "record_video" });
};

const sections = [
  {
    name: "Only FullScreen",
    value: "fullscreen",
  },
  {
    name: "Single Section Capture",
    value: "single_section",
  },
  {
    name: "Multiple Section Capture",
    value: "multiple_section",
  },
];

const Home = () => {
  const [selectedSection, setSelectedSection] = useState({
    name: "Only FullScreen",
    value: "fullscreen",
  });
  const [showSection, setShowSection] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <div className=" w-full flex flex-col items-start">
      <div className=" flex flex-row w-full justify-between  py-2 px-4 bg-red-50 border-[1px] rounded-full border-red-300">
        <button
          onClick={() =>
            handleOperation("take_screenshot", selectedSection.value)
          }
          className=" flex w-10/12 border-r-[1px]  gap-x-4 border-gray-400 flex-row items-center justify-start "
        >
          <TbCapture className=" text-red-600 text-xl" />
          <div className=" flex flex-col items-start">
            <p className=" text-red-600 text-sm">Capture screenshot</p>
            <p className=" text-gray-600 text-[10px]">{selectedSection.name}</p>
          </div>
        </button>
        <button
          ref={ref}
          onClick={() => {
            setShowSection(!showSection);
          }}
          className=" flex w-1/12 flex-row items-center justify-center"
        >
          <FaChevronDown className=" text-red-600 text-base" />
        </button>
      </div>

      <button
        onClick={() => handleOperation("record_video")}
        className=" flex w-full flex-row items-center justify-start mt-4 py-2 px-4 gap-x-4 bg-red-50 border-[1px] rounded-full border-red-300"
      >
        <IoIosVideocam className=" text-red-600 text-xl" />
        <p className=" text-red-600 text-sm">Record Screen</p>
      </button>

      {showSection ? (
        <div
          className="absolute w-full flex flex-col items-start px-2 py-2 bg-black text-white"
          style={{
            top: ref.current
              ? ref.current.getBoundingClientRect().top + 25 + "px"
              : "0px",
            left: ref.current
              ? ref.current.getBoundingClientRect().left - 100 + "px"
              : "0px",
          }}
        >
          <div className="flex flex-col items-start gap-x-2 gap-y-1">
            {sections.map((section, index) => (
              <button
                onClick={() => {
                  setSelectedSection(section);
                  setShowSection(false);
                }}
                className="text-white text-xs"
                key={index}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
