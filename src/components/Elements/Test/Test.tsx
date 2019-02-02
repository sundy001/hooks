import { getFrameStyle } from "../../../getFrameStyle";
import React, { memo, FC } from "react";
import "./Test.css";

const InternalTest: FC<{ id: number; frame: Frame; angle: number }> = ({
  id,
  frame,
  angle
}) => {
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

export type Frame = Readonly<{
  width: number;
  height: number;
  x: number;
  y: number;
}>;

Test.displayName = "Test";
