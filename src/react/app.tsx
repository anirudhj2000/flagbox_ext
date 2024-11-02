import React from "react";
import { useEffect, useState } from "react";
import Home from "./components/home";
import "../tailwind.css";
import Navbar from "./components/navbar";
import { IoMdHelpCircleOutline } from "react-icons/io";
import InvalidPage from "./components/invalid";

export const env = {
  IMAGE_URL: "https://d28exn2y7ee0u1.cloudfront.net/static",
  // LIVE_URL: "https://flagbox-ui.vercel.app",
  LIVE_URL: "https://localhost:3201",
};

export const getDomain = (url: string) => {
  return url.split("/")[2];
};

const validUrl = (url: string) => {
  let domain = getDomain(url);

  if (url.startsWith("https://") || url.startsWith("http://")) {
    if (domain == "localhost:3201" || domain == "flagbox-ui.vercel.app") {
      return false;
    }
    return true;
  }
  return false;
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentTabUrl, setCurrentTabUrl] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentTab = tabs[0]; // First tab is the active tab
      console.log("Current URL: ", currentTab.url);
      setCurrentTabUrl(currentTab?.url);
      if (currentTab?.url && validUrl(currentTab?.url)) {
        setIsValidUrl(true);
      }
    });

    chrome.cookies.getAll({ domain: "localhost" }, (cookies) => {
      console.log("Cookies", cookies);
      let cookie = cookies.find((cookie) => cookie.name == "jwtToken");

      if (cookie && cookie.value) {
        setLoggedIn(true);
        chrome.storage.local.set({ token: cookie.value });
      } else {
        setLoggedIn(false);
      }

      setLoading(false);
    });
  }, []);

  if (!isValidUrl && !loading) {
    return <InvalidPage />;
  }

  return (
    <div className="flex flex-col items-center justify-start w-[350px] h-full bg-white px-4 py-[16px]">
      <Navbar currentTabUrl={currentTabUrl} />

      <div className=" flex flex-col items-center w-full mt-4">
        {loggedIn ? (
          <Home />
        ) : (
          <div className=" flex flex-col items-center w-full mt-4">
            <p className=" text-red-600 text-2xl font-medium">
              Welcome to Flagbox!
            </p>
            <a
              href={env.LIVE_URL + "/login"}
              target="_blank"
              className="px-8 py-2 bg-red-600 text-white mt-2 rounded-lg"
            >
              LOGIN
            </a>
          </div>
        )}
      </div>
      <div className=" mt-4 flex flex-row w-full justify-between">
        <button>
          <IoMdHelpCircleOutline className=" text-xl " />
        </button>
      </div>
    </div>
  );
};

export default App;
