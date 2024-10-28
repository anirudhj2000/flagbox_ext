import React, { useState, useEffect, useRef } from "react";
import Section from "./Section";
import { processImage } from "../utils/helper";
import { SectionCaptureInterface, SectionProps } from "../utils/types";

const SectionCapture = ({ onCapture }: SectionCaptureInterface) => {
  const [loading, setLoading] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleShiftDown = (e: KeyboardEvent) => {
      console.log("shift pressed");
      if (e.key === "Shift") setShiftPressed(true);
    };

    const handleShiftUp = (e: KeyboardEvent) => {
      console.log("shift released");
      if (e.key === "Shift") setShiftPressed(false);
    };

    document.addEventListener("keydown", handleShiftDown);
    document.addEventListener("keyup", handleShiftUp);

    return () => {
      document.removeEventListener("keydown", handleShiftDown);
      document.removeEventListener("keyup", handleShiftUp);
    };
  }, []);

  const resetSection = () => {
    if (sectionRef.current) {
      const style = sectionRef.current.style;
      style.width = "0px";
      style.height = "0px";
      style.left = "0px";
      style.top = "0px";
      style.display = "none";
    }
  };

  useEffect(() => {
    var startX: any = null;
    let startY: any = null;

    const startDrawing = (e: MouseEvent) => {
      console.log("startDrawing", e, sectionRef.current);
      if (sectionRef.current && e.shiftKey) {
        sectionRef.current.style.left = `${e.clientX}px`;
        sectionRef.current.style.top = `${e.clientY}px`;
        sectionRef.current.style.display = "block";

        startX = e.clientX;
        startY = e.clientY;
      }
    };

    const updateSection = (e: MouseEvent) => {
      if (sectionRef.current && e.shiftKey && startX && startY) {
        sectionRef.current.style.width = `${
          e.clientX - sectionRef.current.offsetLeft
        }px`;
        sectionRef.current.style.height = `${
          e.clientY - sectionRef.current.offsetTop
        }px`;
      }
    };

    const stopDrawing = (e: MouseEvent) => {
      console.log("stopDrawing", e, sectionRef.current);
      if (sectionRef.current) {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
          sectionRef.current;
        const x = offsetLeft,
          y = offsetTop,
          width = offsetWidth,
          height = offsetHeight;

        startX = null;
        startY = null;
        setLoading(false);

        console.log("Screenshot being taken", x, y, width, height);
        resetSection();
        takeScreenShot(x, y, width, height);
      }

      setLoading(true);
    };

    document.addEventListener("mousedown", startDrawing);
    document.addEventListener("mousemove", updateSection);
    document.addEventListener("mouseup", stopDrawing);

    return () => {
      document.removeEventListener("mousedown", startDrawing);
      document.removeEventListener("mousemove", updateSection);
      document.removeEventListener("mouseup", stopDrawing);
    };
  }, []);

  const takeScreenShot = async (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    chrome.runtime.sendMessage(
      {
        type: "take_screenshot",
        x,
        y,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      async (response) => {
        if (response?.response) {
          const dataUrl = await processImage(
            response.response,
            x,
            y,
            width,
            height
          );

          let sectionsData = [];
          let obj = {
            dataUrl,
            x,
            y,
            width,
            height,
          };
          sectionsData.push(obj);
          onCapture(sectionsData, response?.response);

          //   console.log("Data URL single section capture", dataUrl);
          //   chrome.runtime.sendMessage({ type: "remove_iframe" });
        }
      }
    );
  };

  return (
    <div className="flex w-screen h-screen bg-black/5">
      <div
        ref={sectionRef}
        className=" absolute bg-red-200/80 border-[1px] border-red-300"
      ></div>
      {shiftPressed && (
        <p className="absolute top-0 right-0 text-black text-xl">
          Shift is pressed
        </p>
      )}
    </div>
  );
};

export default SectionCapture;
