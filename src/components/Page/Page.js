import React from "react";
import "./Page.css";

export const Page = ({ id, width, height, backgroundColor, children }) => {
  return (
    <div
      data-id={id}
      className="page"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: backgroundColor
      }}
    >
      {children}
    </div>
  );
};
