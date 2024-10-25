import React, { useEffect, useRef } from "react";

interface EditorProps {
  imageUrl: string;
}

const Editor = ({ imageUrl }: EditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateImageSize = (
    imageUrl: string
  ): Promise<{ width: number; height: number }> => {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
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

      console.log("Image loaded with dimensions:", data.width, data.height);

      if (canvas) {
        canvas.style.width = `${data.width}px`;
        canvas.style.height = `${data.height}px`;
      }

      const image = new Image();

      image.onload = () => {
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      };

      image.src = imageUrl;
    });
  }, [imageUrl]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      <canvas ref={canvasRef} id="canvas" className=" bg-black" />
    </div>
  );
};

export default Editor;
