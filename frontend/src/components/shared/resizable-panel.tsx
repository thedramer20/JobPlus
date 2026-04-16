import React from "react";
import { useResizable } from "../../lib/use-resizable";

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  direction?: "horizontal" | "vertical";
  onResize?: (size: number) => void;
  className?: string;
  resizerClassName?: string;
}

export function ResizablePanel({
  children,
  defaultSize = 300,
  minSize = 200,
  maxSize = 800,
  direction = "horizontal",
  onResize,
  className = "",
  resizerClassName = ""
}: ResizablePanelProps) {
  const { containerRef, resizerRef, size, isResizing } = useResizable({
    initialSize: defaultSize,
    minSize,
    maxSize,
    direction,
    onResize
  });

  const isHorizontal = direction === "horizontal";
  const containerStyle: React.CSSProperties = isHorizontal
    ? { width: size, display: "flex", flexDirection: "column" }
    : { height: size, display: "flex", flexDirection: "row" };

  const resizerStyle: React.CSSProperties = isHorizontal
    ? {
        width: "4px",
        backgroundColor: isResizing ? "var(--primary)" : "var(--border)",
        cursor: "col-resize",
        transition: isResizing ? "none" : "background-color var(--transition-fast)",
        marginRight: "0"
      }
    : {
        height: "4px",
        backgroundColor: isResizing ? "var(--primary)" : "var(--border)",
        cursor: "row-resize",
        transition: isResizing ? "none" : "background-color var(--transition-fast)",
        marginBottom: "0"
      };

  return (
    <div ref={containerRef} style={containerStyle} className={className}>
      {children}
      <div
        ref={resizerRef}
        style={resizerStyle}
        className={`resizer ${isResizing ? "is-resizing" : ""} ${resizerClassName}`}
        title={isHorizontal ? "Drag to resize horizontally" : "Drag to resize vertically"}
      />
    </div>
  );
}
