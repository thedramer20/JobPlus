import { useRef, useEffect, useState } from "react";

interface ResizeConfig {
  minSize: number;
  maxSize: number;
  initialSize: number;
  onResize?: (size: number) => void;
  direction?: "horizontal" | "vertical";
}

export function useResizable({
  minSize = 200,
  maxSize = 800,
  initialSize = 300,
  onResize,
  direction = "horizontal"
}: ResizeConfig) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const resizer = resizerRef.current;
    if (!container || !resizer) return;

    const handleMouseDown = () => {
      setIsResizing(true);
    };

    resizer.addEventListener("mousedown", handleMouseDown);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !container) return;

      e.preventDefault();

      const rect = container.getBoundingClientRect();
      let newSize: number;

      if (direction === "horizontal") {
        newSize = e.clientX - rect.left;
      } else {
        newSize = e.clientY - rect.top;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
      onResize?.(newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      resizer.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isResizing, minSize, maxSize, direction, onResize]);

  return { containerRef, resizerRef, size, isResizing };
}
