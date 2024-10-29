import React from "react";
import { useEffect, useState } from "react";
import "../tailwind.css";
import { IoMdHelpCircleOutline } from "react-icons/io";

export const env = {
  IMAGE_URL: "https://d28exn2y7ee0u1.cloudfront.net/static",
  // LIVE_URL: "https://flagbox-ui.vercel.app",
  LIVE_URL: "http://localhost:5001",
};

const App = () => {
  const [type, setType] = useState("");

  useEffect(() => {
    chrome.storage.local.get("section", (data) => {
      console.log("section", data.section);
      setType(data.section);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen bg-transparent px-4 py-[16px]">
      <p className="text-red-600 font-bold text-2xl">Video {type}</p>
    </div>
  );
};

export default App;
