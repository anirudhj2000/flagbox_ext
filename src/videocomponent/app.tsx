import React from "react";
import { useEffect, useState } from "react";
import "../tailwind.css";
import { IoMdHelpCircleOutline } from "react-icons/io";
import Countdown from "./components/Countdown";
import { FaStopCircle } from "react-icons/fa";


export const env = {
  IMAGE_URL: "https://d28exn2y7ee0u1.cloudfront.net/static",
  // LIVE_URL: "https://flagbox-ui.vercel.app",
  LIVE_URL: "http://localhost:5001",
};

const App = () => {
  const [type, setType] = useState("");
  const [showCountdown, setShowCountdown] = useState(true);

  const startRecording = () => {
    chrome.runtime.sendMessage({ type: "start_recording" });
    // window.parent.postMessage({ type: "start_recording" }, "*");
    setShowCountdown(false);
  };

  return (
    <div className={`flex flex-col relative items-center justify-center w-screen h-screen ${showCountdown ? "bg-black/5" : "bg-transparent"} px-4 py-[16px]`}>
      {showCountdown ?
        <div className="w-[40vh] h-[40vh] rounded-full flex flex-col shadow-2xl items-center justify-center bg-white">
          <p className=" text-xl text-red-400 font-bold">Recording will start in</p>
          <Countdown initialCount={2} onCountEnd={() => {
            startRecording();
          }} />
        </div> :
        <button onClick={() => { chrome.runtime.sendMessage({ type: "stop_recording" }) }} className=" px-4 py-2 rounded-full flex flex-row items-center bg-red-500 text-white">
          <FaStopCircle />
          <p className="ml-2">Stop Recording</p>
        </button>
      }
    </div>
  );
};

export default App;
