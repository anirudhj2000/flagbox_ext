import React from "react";
import { useEffect, useState } from "react";
import Home from "./components/home";
import "../tailwind.css";
import { IoIosSettings } from "react-icons/io";
import { FaHeartCircleBolt } from "react-icons/fa6";
import { MdHome } from "react-icons/md";
import { IoMdHelpCircleOutline } from "react-icons/io";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    chrome.cookies.getAll({ domain: "localhost" }, (cookies) => {
      console.log("Cookies", cookies);
      chrome.storage.local.set({ token: cookies[0].value });

      let token = cookies[0].value;

      if (token.length > 0) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        chrome.runtime.sendMessage({ type: "loginpopup" });
      }
    });

    // chrome.storage.local.get("token", (data) => {
    //   console.log("Token", data);
    //   if (data.token) {
    //     setLoggedIn(true);
    //   } else {
    //     setLoggedIn(false);
    //     chrome.runtime.sendMessage({ type: "loginpopup" });
    //   }
    // });
  }, []);

  return (
    <div className="flex flex-col items-center justify-start w-[350px] h-[200px] bg-red-50 p-4">
      <div className=" flex flex-row w-full justify-between">
        <h2 className=" text-xl text-red-400 font-medium">Flagbox</h2>
        <div className=" flex flex-row gap-x-3">
          <button className=" cursor-pointer hover:shadow-lg">
            <MdHome className=" text-gray-500 text-xl" />
          </button>
          <button className=" cursor-pointer hover:shadow-lg">
            <IoIosSettings className=" text-gray-500 text-xl" />
          </button>
        </div>
      </div>

      <div className=" flex flex-col items-center w-full mt-8">
        {loggedIn ? (
          <Home />
        ) : (
          <div className=" flex flex-col items-center w-full">
            <FaHeartCircleBolt className=" text-3xl text-red-500 cursor-pointer" />
            <p className=" text-red-400 text-xl">Welcome to flagbox!</p>
            <button className="px-8 py-2 bg-red-400 text-white mt-2 rounded-lg">
              LOGIN
            </button>
          </div>
        )}
      </div>
      <div className=" absolute bottom-2 flex flex-row w-full justify-between px-2">
        <div></div>

        <button>
          <IoMdHelpCircleOutline className=" text-xl " />
        </button>
      </div>
    </div>
  );
};

export default App;
