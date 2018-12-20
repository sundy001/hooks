import { useElement } from "./hooks/useElement";
import React, { memo } from "react";
import "./Test.css";

export const Test = memo(({ id, ...props }) => {
  const elementProps = useElement(props);

  return <div data-id={id} className="element" {...elementProps} />;
});
