import React, { Suspense, memo, SFC } from "react";
import "./Page.css";
import { createElements } from "../App/createElements";

const InternalPage: SFC<{
  id: number;
  width: number;
  height: number;
  backgroundColor: string;
  elements: any[];
  dispatch: (action: any) => any;
  controlBox: Frame;
  zoom: number;
}> = ({
  id,
  width,
  height,
  backgroundColor,
  elements,
  dispatch,
  controlBox,
  zoom = 1
}) => {
  return (
    <div
      data-id={id}
      className="page"
      style={{
        width: `${width * zoom}px`,
        height: `${height * zoom}px`,
        backgroundColor: backgroundColor
      }}
    >
      <div className="page__elements" style={{ transform: `scale(${zoom})` }}>
        <Suspense fallback={<div>Loading...</div>}>
          {createElements(elements, { dispatch, zoom })}
        </Suspense>
      </div>
      {controlBox}
    </div>
  );
};

export const Page = memo(InternalPage);

Page.displayName = "Page";

type Frame = Readonly<{
  width: number;
  height: number;
  x: number;
  y: number;
}>;
