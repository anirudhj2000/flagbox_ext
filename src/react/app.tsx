import React from "react";
import { useEffect, useState } from "react";
import Home from "./components/home";
import Landing from "./components/landing";
import "../tailwind.css";
import { IoIosSettings } from "react-icons/io";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("token", (data) => {
      console.log("Token", data);
      if (data.token) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-[350px] h-[250px] bg-red-100 p-4">
      <div className=" flex flex-row w-full justify-between">
        <h2 className=" text-xl text-red-400 font-medium">Flagbox</h2>
        <button className=" cursor-pointer">
          <IoIosSettings className=" text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default App;
