import React from "react";
import "./Page.css";

export const Page = ({ width, height, children }) => {
  return (
    <div
      className="page"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {children}
    </div>
  );
};
