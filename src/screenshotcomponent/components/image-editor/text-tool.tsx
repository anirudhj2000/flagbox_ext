import { useState, useRef, useEffect } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";

interface TextTool {
  x: number;
  y: number;
  text: string;
  hovered: boolean;
  id?: string;
}

interface TextToolProps {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  color: string;
  size: number;
  font: string;
  textArray: TextTool[];
  onDraw: ({ x, y, text }: TextTool) => void;
}

const generateId = () => {
  let number = Math.random() * 1000000;
  number = Math.floor(number);
  return number + "";
};

export function TextTool({
  canvas,
  context,
  color,
  size,
  font,
  textArray,
  onDraw,
}: TextToolProps) {
  const [text, setText] = useState("");
  const [dimensions, setDimensions] = useState({ width: "", height: "" });
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (canvas) {
      setDimensions({
        width: canvas?.style.width,
        height: canvas?.style.height
      });
    }
  }, [canvas?.style.width, canvas?.style.height]);

  useEffect(() => {
    if (context) {
      context.font = `${size}px ${font}`;
      context.fillStyle = color;
    }
  }, [context, color, size, font]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvas) {
      const rect = canvas.getBoundingClientRect();

      const scale = Math.min(canvas.width / rect.width, canvas.height / rect.height);

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x: x * scale, y: y * scale });
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("text change", e.target.value);
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && context && position) {
      //   context.fillText(text, position.x, position.y);
      setText("");
      setPosition(null);
      let Obj: TextTool = {
        x: position.x,
        y: position.y,
        text: text,
        id: generateId(),
        hovered: false,
      };
      onDraw(Obj);
    }
  };

  return (
    <>
      <canvas
        onClick={handleClick}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "all", width: dimensions?.width, height: dimensions?.height }}
        width={canvas?.width}
        height={canvas?.height}
      />

      {position && (
        <div
          style={{
            left: position.x,
            top: position.y,
          }}
          className=" absolute flex flex-col items-start border-[0.5px] border-[#c7c7c7] shadow-xl rounded-lg bg-white w-[15vw] px-2 py-2"
        >

          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Add Comment"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              marginTop: "4px",
            }}
          />
          <div className=" flex flex-row w-full justify-end gap-x-2 px-2 mt-2">
            <button
              className=" flex flex-row justify-center items-center gap-x-1"
              onClick={() => {
                setText("");
                setPosition(null);
              }}
            >
              <IoIosCloseCircle className=" text-lg text-red-500" />
            </button>

            <button
              className=" flex flex-row justify-center items-center gap-x-1"
              onClick={() => {
                if (context && position) {
                  context.fillText(text, position.x, position.y);
                  setText("");
                  setPosition(null);
                  let Obj: TextTool = {
                    x: position.x,
                    y: position.y,
                    text: text,
                    id: generateId(),
                    hovered: false,
                  };
                  onDraw(Obj);
                }
              }}
            >
              <IoCheckmarkCircle className=" text-lg text-green-500" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
