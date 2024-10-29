import { useEffect, useRef, useState } from "react";

interface PenToolProps {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  color: string;
  size: number;
  onDraw: () => void;
}

export function PenTool({
  canvas,
  context,
  color,
  size,
  onDraw,
}: PenToolProps) {

  const [dimensions, setDimensions] = useState({ width: "", height: "" });
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

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
      context.strokeStyle = color;
      context.lineWidth = size;
    }
  }, [context, color, size]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {

    console.log("startDrawing", e, canvas?.style.width, canvas?.style.height, canvas?.width, canvas?.height, canvas?.getBoundingClientRect());
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(canvas.width / rect.width, canvas.height / rect.height);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setIsDrawing(true);
      lastPositionRef.current = { x: x * scale, y: y * scale };
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvas || !lastPositionRef.current) return;

    const rect = canvas.getBoundingClientRect();

    const scale = Math.min(canvas.width / rect.width, canvas.height / rect.height);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.lineCap = "round";
    context.lineJoin = "round";

    context.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
    context.lineTo(x * scale, y * scale);
    context.stroke();

    lastPositionRef.current = { x: x * scale, y: y * scale };
    onDraw();
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    lastPositionRef.current = null;
  };

  return (
    <canvas
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "all", width: dimensions?.width, height: dimensions?.height }}
      width={canvas?.width + "px"}
      height={canvas?.height + "px"}
    />
  );
}
