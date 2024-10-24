import React from "react";
import { env } from "../app";

const InvalidPage = () => {
  return (
    <div className="w-[300px] h-[100px] flex flex-row items-center gap-x-4 justify-center bg-white ">
      <img
        className=" h-[50px] w-[80px] relative"
        src={env.IMAGE_URL + "/flagbox_logo_2.png"}
        style={{
          objectFit: "contain",
        }}
      />

      <div className="w-[180px] flex flex-col items-start">
        <p className="text-red-600 text-sm font-semibold ">
          Navigate to any website to use FlagBox
        </p>
      </div>
    </div>
  );
};

export default InvalidPage;
