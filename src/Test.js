import { useElement } from "./hooks/useElement";
import React, { memo } from "react";
import "./Test.css";

export const Test = memo(({ id, ...props }) => {
  const elementProps = useElement(props);

  return (
    <div data-id={id} tabIndex="0" className="element" {...elementProps} />
  );
});
