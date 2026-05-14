import React from "react";
import { useResizable } from "../../lib/use-resizable";

interface SplitLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftSize?: number;
  minLeftSize?: number;
  maxLeftSize?: number;
  onResize?: (leftSize: number) => void;
  className?: string;
}

export function SplitLayout({
  leftPanel,
  rightPanel,
  defaultLeftSize = 350,
  minLeftSize = 250,
  maxLeftSize = 600,
  onResize,
  className = ""
}: SplitLayoutProps) {
  const { containerRef, resizerRef, size, isResizing } = useResizable({
    initialSize: defaultLeftSize,
    minSize: minLeftSize,
    maxSize: maxLeftSize,
    direction: "horizontal",
    onResize
  });

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        gap: 0,
        overflow: "hidden"
      }}
      className={className}
    >
      {/* Left Panel */}
      <div
        style={{
          width: size,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          borderRight: "1px solid var(--border)"
        }}
      >
        {leftPanel}
      </div>

      {/* Resizer */}
      <div
        ref={resizerRef}
        style={{
          width: "4px",
          height: "100%",
          backgroundColor: isResizing ? "var(--primary)" : "var(--border)",
          cursor: "col-resize",
          transition: isResizing ? "none" : "background-color var(--transition-fast)"
        }}
        className={`resizer ${isResizing ? "is-resizing" : ""}`}
        title="Drag to resize panels"
      />

      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto"
        }}
      >
        {rightPanel}
      </div>
    </div>
  );
}
