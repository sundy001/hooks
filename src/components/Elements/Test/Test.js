import { getFrameStyle } from "../../../getFrameStyle";
import React, { memo } from "react";
import "./Test.css";

export const Test = memo(({ id, frame, angle }) => {
  return (
    <div
      data-id={id}
      tabIndex="0"
      className="element"
      style={{
        ...getFrameStyle(frame, angle),
        background: "brown"
      }}
    />
  );
});

Test.displayName = "Test";
