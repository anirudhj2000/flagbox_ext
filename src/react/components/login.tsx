import React from "react";
import { useState, useEffect } from "react";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("token");
    console.log("Checking for token", token);
    token && onLogin();
  }, []);

  const handleLogin = async () => {
    console.log("Login clicked");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");

    try {
      chrome.runtime.sendMessage(
        {
          type: "login",
          email,
          password,
        },
        function (response) {
          console.log("login response", response);
          if (response && response.error) {
            setError(response.error);
          } else {
            console.log("Login successful");
            onLogin();
          }
        }
      );
    } catch (error) {
      setError("An error occurred");
    } finally {
      onLogin();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: "100%",
      }}
    >
      <h2>Login</h2>
      <form>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "100%",
          }}
        >
          <label
            style={{
              color: "black",
              fontSize: "16px",
            }}
          >
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              border: "solid 1px #fc5151",
              padding: "4px",
              borderRadius: "4px",
              color: "black",
            }}
          />
        </div>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "100%",
          }}
        >
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              border: "solid 1px #fc5151",
              padding: "4px",
              borderRadius: "4px",
              color: "black",
            }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          onClick={() => {
            handleLogin();
          }}
          style={{ marginTop: "10px" }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
