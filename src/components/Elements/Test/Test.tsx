import { getFrameStyle } from "../../../getFrameStyle";
import React, { memo, SFC } from "react";
import "./Test.css";

const InternalTest: SFC<any> = ({ id, frame, angle }) => {
  return (
    <div
      data-id={id}
      tabIndex={0}
      className="element"
      style={{
        ...getFrameStyle(frame, angle),
        background: "brown"
      }}
    />
  );
};

export const Test = memo(InternalTest);

Test.displayName = "Test";
