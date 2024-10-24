import React from "react";
import { IoIosSettings } from "react-icons/io";
import { FaHeartCircleBolt } from "react-icons/fa6";
import { MdHome } from "react-icons/md";
import { env } from "../app";
import { getDomain } from "../app";

interface Props {
  currentTabUrl: string;
}

const Navbar = ({ currentTabUrl }: Props) => {
  return (
    <div className=" flex flex-row w-full items-center justify-between">
      <img
        className=" h-[50px] w-[100px] relative"
        src={env.IMAGE_URL + "/flagbox_logo_2.png"}
        style={{
          objectFit: "contain",
        }}
      />
      <p className=" text-red-600 underline text-xs">
        {getDomain(currentTabUrl)}
      </p>
      <div className=" flex flex-row gap-x-3">
        <button className=" cursor-pointer hover:shadow-lg">
          <MdHome className=" text-gray-500 text-xl" />
        </button>
        <button className=" cursor-pointer hover:shadow-lg">
          <IoIosSettings className=" text-gray-500 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
