import React, { useEffect, useRef, useState } from "react";
import { EditorProps, EditorState, TextToolInterface } from "../../utils/types";
import { PenTool } from "./pen-tool";
import { TextTool } from "./text-tool";
import { BlurTool } from "./blur-tool";
import { IoIosBrush, IoIosCloseCircle, IoIosText, IoMdArrowBack, IoMdArrowForward, IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegSave } from "react-icons/fa";
import { LuUndo2 } from "react-icons/lu";
import { LuRedo2 } from "react-icons/lu";
import { MdOutlineBlurOn } from "react-icons/md";
import { PiTextT } from "react-icons/pi";
import { HiMiniPencil } from "react-icons/hi2";
import { PiBroomFill } from "react-icons/pi";


const Editor = ({ imageUrl, width, height }: EditorProps) => {

  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState<EditorState>({
    tool: "pen",
    color: "#000000",
    size: 5,
    font: "Arial",
    blurIntensity: 5,
  });
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedTexts, setSavedTexts] = useState<TextToolInterface[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const difRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        contextRef.current = context;
      }
    }
  }, []);

  const calculateImageSize = (
    imageUrl: string
  ): Promise<{ width: number; height: number }> => {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        reject("Failed to load image");
      };
      img.src = imageUrl;
    });
  };

  const saveToHistory = () => {
    if (canvasRef.current && contextRef.current) {
      const imageData = contextRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      setHistory((prevHistory) => [
        ...prevHistory.slice(0, historyIndex + 1),
        imageData,
      ]);
      setHistoryIndex((prevIndex) => prevIndex + 1);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
      if (canvasRef.current && contextRef.current) {
        contextRef.current.putImageData(history[historyIndex - 1], 0, 0);
      }
    }
  };

  const clear = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      fetchImage();
      saveToHistory();
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      if (canvasRef.current && contextRef.current) {
        contextRef.current.putImageData(history[historyIndex + 1], 0, 0);
      }
    }
  };

  const fetchImage = () => {
    setLoading(true);
    calculateImageSize(imageUrl).then((data) => {
      const canvas = canvasRef.current;

      if (canvas) {

        let dpi = window.devicePixelRatio;

        canvas.setAttribute("width", data.width * dpi + "px");
        canvas.setAttribute("height", data.height * dpi + "px");

        console.log("Canvas dimensions", data.width, data.height, canvas.width, canvas.height, dpi);

        const parent = difRef.current;
        if (parent) {
          let parentWidth = parent.offsetWidth;
          let parentHeight = parent.offsetHeight;

          let canvasWidth = data.width * dpi;
          let canvasHeight = data.height * dpi;

          console.log("Dimensions", canvasWidth, canvasHeight, parentWidth, parentHeight);

          if (canvasWidth > parentWidth || canvasHeight > parentHeight) {
            const scale = Math.min(
              parentWidth / canvasWidth,
              parentHeight / canvasHeight
            );

            canvas.style.width = (canvasWidth * scale * 0.85) + "px";
            canvas.style.height = (canvasHeight * scale * 0.85) + "px";


            console.log("Scale", scale, canvas.style.width, canvas.style.height);
          } else {
            canvas.style.width = canvasWidth * 0.9 + "px";
            canvas.style.height = canvasHeight * 0.9 + "px";
          }
        }

      }

      const image = new Image();

      image.onload = () => {
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
              image,
              0,
              0,
              data.width,
              data.height,
              0,
              0,
              canvas.width,
              canvas.height
            );
          }

          setLoading(false);
        }
      };

      image.src = imageUrl;
    });
  }




  useEffect(() => {
    if (!imageUrl) {
      return;
    }
    fetchImage();
  }, [imageUrl]);

  return (
    <div ref={difRef} className="w-full h-full flex flex-col items-center justify-center ">
      <div className=" h-[7.5%] w-full flex flex-row items-center justify-center  px-4">


        <div className=" flex flex-row gap-x-4 px-8 py-2 bg-red-100 rounded-full tems-center">
          <button className={`${activeTool === "pen" ? "bg-white rounded-full " : ""}`} onClick={() => {
            setActiveTool("pen")
            setEditorState({ ...editorState, tool: "pen" })
          }}>
            <HiMiniPencil className=" text-gray-600 text-xl" />
          </button>
          <button className={`${activeTool === "text" ? "bg-white rounded-full" : ""}`} onClick={() => {
            setActiveTool("text")
            setEditorState({ ...editorState, tool: "text" })
          }}>
            <PiTextT className="  text-gray-600 text-xl" />
          </button>
          <button className={`${activeTool === "blur" ? "bg-white rounded-full" : ""}`} onClick={() => {
            setActiveTool("blur")
            setEditorState({ ...editorState, tool: "blur" })
          }}>
            <MdOutlineBlurOn className=" text-gray-600 text-xl" />
          </button>
          <button onClick={undo}>
            <LuUndo2 className=" text-gray-600 text-xl" />
          </button>
          <button onClick={redo}>
            <LuRedo2 className=" text-gray-600 text-xl" />
          </button>
          <button onClick={clear}>
            <PiBroomFill className=" text-gray-600 text-xl" />
          </button>
        </div>
      </div>
      <div id="canvas-container" className=" relative h-[92.5%] w-full flex flex-col items-center justify-center">
        <canvas ref={canvasRef} id="canvas" className=" bg-black" />
        {editorState.tool === "pen" && !loading ? (
          <PenTool
            canvas={canvasRef.current}
            context={contextRef.current}
            color={editorState.color}
            size={editorState.size}
            onDraw={saveToHistory}
          />
        ) : null}
        {editorState.tool === "text" && !loading ? (
          <TextTool
            canvas={canvasRef.current}
            context={contextRef.current}
            color={editorState.color}
            size={editorState.size}
            textArray={savedTexts}
            font={editorState.font}
            onDraw={({ x, y, text, hovered, id }: TextToolInterface) => {
              saveToHistory();
              setSavedTexts((prevTexts) => [
                ...prevTexts,
                { x, y, text, id, hovered },
              ]);
            }}
          // onDraw={saveToHistory}
          />
        ) : null}
        {editorState.tool === "blur" && !loading ? (
          <BlurTool
            canvas={canvasRef.current}
            context={contextRef.current}
            intensity={editorState.blurIntensity}
            onDraw={saveToHistory}
          />
        ) : null}
        {savedTexts.map((textObj, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: textObj.x,
              top: textObj.y,
            }}
            onMouseEnter={() => {
              setSavedTexts((prevTexts) =>
                prevTexts.map((text, i) =>
                  i === index ? { ...text, hovered: true } : text
                )
              );
            }}
            onMouseLeave={() => {
              setSavedTexts((prevTexts) =>
                prevTexts.map((text, i) =>
                  i === index ? { ...text, hovered: false } : text
                )
              );
            }}
          >
            <div
              className=" w-5 h-5 shadow-lg flex flex-col items-center justify-center bg-white/50"
              style={{
                borderRadius: "100%",

              }}
            >
              <div
                className=" w-3 h-3 shadow-lg bg-white"
                style={{
                  borderRadius: "100%",
                  border: "1px solid #c7c7c7",
                }}
              />
            </div>
            {textObj.hovered ? (
              <div className=" mt-1 p-2 max-w-[10vw] bg-white border-[0.5px] border-[#c7c7c7] rounded-lg shadow-lg relative ">
                <button
                  onClick={() => {
                    setSavedTexts((prevTexts) =>
                      prevTexts.filter((_, i) => i !== index)
                    );
                  }}
                  className=" absolute -top-2 -right-2 bg-white rounded-full cursor-pointer shadow-lg"
                >
                  <IoMdCloseCircleOutline className=" h-4 w-4 text-[#3d3d3d]" />
                </button>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  {textObj.text}
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Editor;
