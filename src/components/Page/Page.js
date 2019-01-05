import React, { Suspense, memo } from "react";
import "./Page.css";
import { createElements } from "../App/createElements";

export const Page = memo(
  ({ id, width, height, backgroundColor, elements, dispatch, controlBox }) => {
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
        <Suspense fallback={<div>Loading...</div>}>
          {createElements(dispatch, elements)}
        </Suspense>
        {controlBox}
      </div>
    );
  }
);

Page.displayName = "Page";
