import { useElement } from "./hooks/useElement";
import React, { memo } from "react";
import "./Test.css";

const Test = ({ id, ...props }) => {
  const elementProps = useElement(props);

  return <div data-id={id} className="element" {...elementProps} />;
};

export default memo(Test);
