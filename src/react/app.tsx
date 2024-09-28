import React from "react";
import { useEffect, useState } from "react";
import Home from "./components/home";
import "../tailwind.css";
import { IoIosSettings } from "react-icons/io";
import { FaHeartCircleBolt } from "react-icons/fa6";
import { MdHome } from "react-icons/md";
import { IoMdHelpCircleOutline } from "react-icons/io";

const env = {
  IMAGE_URL: "https://d28exn2y7ee0u1.cloudfront.net/static",
  LIVE_URL: "https://flagbox-ui.vercel.app",
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentTabUrl, setCurrentTabUrl] = useState<any>("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentTab = tabs[0]; // First tab is the active tab
      console.log("Current URL: ", currentTab.url);
      setCurrentTabUrl(currentTab?.url);
    });

    chrome.cookies.getAll({ domain: "flagbox-ui.vercel.app" }, (cookies) => {
      console.log("Cookies", cookies);
      let cookie = cookies.find((cookie) => cookie.name == "jwtToken");

      if (cookie && cookie.value) {
        setLoggedIn(true);
        chrome.storage.local.set({ token: cookie.value });
      } else {
        setLoggedIn(false);
        // chrome.runtime.sendMessage({ type: "loginpopup" });
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-[350px] h-full bg-red-50 px-4 py-[16px]">
      <div className=" flex flex-row w-full justify-between">
        <img
          className=" h-[50px] w-[100px] relative"
          src={env.IMAGE_URL + "/flagbox_logo_2.png"}
          style={{
            objectFit: "contain",
          }}
        />
        <div className=" flex flex-row gap-x-3">
          <button className=" cursor-pointer hover:shadow-lg">
            <MdHome className=" text-gray-500 text-xl" />
          </button>
          <button className=" cursor-pointer hover:shadow-lg">
            <IoIosSettings className=" text-gray-500 text-xl" />
          </button>
        </div>
      </div>
      <div className=" w-full mt-2">
        <p className=" text-red-400 underline text-xs">
          {currentTabUrl.toString().split("://")[1]}
        </p>
      </div>

      <div className=" flex flex-col items-center w-full mt-2">
        {loggedIn ? (
          <Home />
        ) : (
          <div className=" flex flex-col items-center w-full mt-2">
            <img
              className=" h-[50px] w-[100px] relative"
              src={env.IMAGE_URL + "/flagbox_logo_2.png"}
              style={{
                objectFit: "contain",
              }}
            />
            <p className=" text-red-400 text-xl">Welcome to flagbox!</p>
            <a
              href={env.LIVE_URL + "/login"}
              target="_blank"
              className="px-8 py-2 bg-red-400 text-white mt-2 rounded-lg"
            >
              LOGIN
            </a>
          </div>
        )}
      </div>
      <div className=" mt-4 flex flex-row w-full justify-between px-2">
        <div></div>

        <button>
          <IoMdHelpCircleOutline className=" text-xl " />
        </button>
      </div>
    </div>
  );
};

export default App;
