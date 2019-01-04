import React from "react";
import "./Page.css";

export const Page = React.forwardRef(
  ({ id, width, height, backgroundColor, children }, ref) => {
    return (
      <div
        data-id={id}
        ref={ref}
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
  }
);
