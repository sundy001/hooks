import React, { ReactElement, Suspense, memo, FC } from "react";
import "./Page.css";
import { createElements } from "../App/createElements";
import { ElementEntity } from "../App/type";

const InternalPage: FC<{
  id: number;
  width: number;
  height: number;
  backgroundColor: string;
  elements: ElementEntity[];
  dispatch: (action: any) => void;
  controlBox: ReactElement<object> | null;
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
