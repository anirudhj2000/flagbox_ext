import React, { useEffect, useRef } from "react";
import { EditorProps } from "../../utils/types";

const Editor = ({ imageUrl, width, height }: EditorProps) => {
  const difRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

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


  
  

  useEffect(() => {
    if (!imageUrl) {
      return;
    }

    calculateImageSize(imageUrl).then((data) => {
      const canvas = canvasRef.current;

      if (canvas) {

        let dpi = window.devicePixelRatio;

        canvas.setAttribute("width",data.width * dpi + "px");
        canvas.setAttribute("height", data.height * dpi + "px");

        console.log("Canvas dimensions",data.width, data.height, canvas.width, canvas.height, dpi);

        const parent = difRef.current;
        if (parent) {
          let parentWidth = parent.offsetWidth;
          let parentHeight = parent.offsetHeight;

          let canvasWidth = data.width * dpi;
          let canvasHeight = data.height * dpi;

          console.log("Dimensions",canvasWidth, canvasHeight, parentWidth, parentHeight);

          if (canvasWidth > parentWidth || canvasHeight > parentHeight) {
            const scale = Math.min(
              parentWidth / canvasWidth,
              parentHeight / canvasHeight
            );

            canvas.style.width = (canvasWidth * scale ) + "px";
            canvas.style.height = (canvasHeight * scale ) + "px";
           

            console.log("Scale",scale, canvas.style.width, canvas.style.height);
          } else {
            canvas.style.width = canvasWidth + "px";
            canvas.style.height = canvasHeight + "px";
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
              data.width ,
              data.height,
              0,
              0,
              canvas.width,
              canvas.height
            );
          }
        }
      };

      image.src = imageUrl;
    });
  }, [imageUrl]);

  return (
    <div ref={difRef} className="w-full h-full flex flex-col items-center justify-center ">
      <canvas ref={canvasRef} id="canvas" className=" bg-black" />
    </div>
  );
};

export default Editor;
