import { useState, useEffect, useRef } from "react";

interface BlurToolProps {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  intensity: number;
  onDraw: () => void;
}

export function BlurTool({
  canvas,
  context,
  intensity,
  onDraw,
}: BlurToolProps) {
  const [isBlurring, setIsBlurring] = useState(false);
  const [dimensions, setDimensions] = useState({ width: "", height: "" });
  const blurRegion = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);


  useEffect(() => {
    if (canvas) {
      setDimensions({
        width: canvas?.style.width,
        height: canvas?.style.height
      });
    }
  }, [canvas?.style.width, canvas?.style.height]);

  const drawBlurRegionBorder = () => {
    if (canvas && context && blurRegion.current) {
      const { x, y, width, height } = blurRegion.current;
      context.save();
      context.strokeStyle = "#ababab";
      context.lineWidth = 0.5;
      context.strokeRect(x, y, width, height);
      context.restore();
    }
  };

  useEffect(() => {
    if (canvas && context && !isBlurring && blurRegion.current) {
      const { x, y, width, height } = blurRegion.current || {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
      console.log("blur region dtaa", blurRegion, isBlurring);
      if (width > 0 && height > 0) {
        const imageData = context.getImageData(x, y, width, height);
        const blurredImageData = applyBlur(imageData, intensity);
        context.putImageData(blurredImageData, x, y);
        drawBlurRegionBorder();
        onDraw();
      }
    }
  }, [canvas, context, isBlurring, intensity]);

  const startBlurring = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log("mouse down called");
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(canvas.width / rect.width, canvas.height / rect.height);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setIsBlurring(true);
      blurRegion.current = { x: x * scale, y: y * scale, width: 0, height: 0 };
    }
  };

  const updateBlurRegion = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isBlurring && canvas && blurRegion.current) {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(canvas.width / rect.width, canvas.height / rect.height);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (blurRegion.current) {
        blurRegion.current = {
          ...blurRegion.current,
          width: x * scale - (blurRegion.current?.x || 0),
          height: y * scale - (blurRegion.current?.y || 0),
        };
      }
    }
  };

  const stopBlurring = () => {
    console.log("mouse up called");
    if (isBlurring) {
      setIsBlurring(false);
    }
  };

  const applyBlur = (imageData: ImageData, intensity: number) => {
    // Implement a simple box blur algorithm

    const { data, width, height } = imageData;
    const output = new ImageData(new Uint8ClampedArray(data), width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0,
          count = 0;

        for (let dy = -intensity; dy <= intensity; dy++) {
          for (let dx = -intensity; dx <= intensity; dx++) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const i = (ny * width + nx) * 4;
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              a += data[i + 3];
              count++;
            }
          }
        }

        const i = (y * width + x) * 4;
        output.data[i] = r / count;
        output.data[i + 1] = g / count;
        output.data[i + 2] = b / count;
        output.data[i + 3] = a / count;
      }
    }

    return output;
  };

  return (
    <canvas
      onMouseDown={startBlurring}
      onMouseMove={updateBlurRegion}
      onMouseUp={stopBlurring}
      onMouseOut={stopBlurring}
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "all", width: dimensions?.width, height: dimensions?.height }}
      width={canvas?.width + "px"}
      height={canvas?.height + "px"}
    />
  );
}
