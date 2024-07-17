import React from "react";

interface LandingProps {
  handleClick: () => void;
}

const Landing = ({ handleClick }: LandingProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "solid 1px #fc5151",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <p style={{ fontSize: 20, color: "#fc5151" }}>Welcome to Flagbox</p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <p style={{ color: "black" }}>Already have an account?</p>
        <a
          onClick={handleClick}
          style={{ marginLeft: 3, color: "#fc5151", cursor: "pointer" }}
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default Landing;
