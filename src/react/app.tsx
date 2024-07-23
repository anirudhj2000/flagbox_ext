import React from "react";
import { useEffect, useState } from "react";
import Login from "./components/login";
import Home from "./components/home";
import Landing from "./components/landing";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("message", message);
      if (message.type === "LOGIN") {
        setLoggedIn(true);
      }
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "start",
        width: 250,
        margin: 0,
        padding: "2.5% 5% 2.5% 5%",
        backgroundColor: "#fce1e1",
      }}
    >
      <h1 style={{ fontSize: 24, color: "#fc5151", fontWeight: "medium" }}>
        Flagbox
      </h1>
      <div style={{ width: "90%", height: "100%" }}>
        {loggedIn ? (
          <Home />
        ) : showLogin ? (
          <Login
            onLogin={() => {
              setLoggedIn(true);
            }}
          />
        ) : (
          <Landing
            handleClick={() => {
              setShowLogin(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
