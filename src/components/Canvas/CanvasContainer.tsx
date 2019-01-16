import "./Canvas.scss";
import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
  memo,
  FC
} from "react";

import { ControlBox } from "../ControlBox";

import { updateElements } from "../App/actions";

import { emit } from "../../eventBus";
import { useResize } from "../../hooks/useResize";
import { useRotate } from "../../hooks/useRotate";
import { useDoubleClick } from "../../hooks/useDoubleClick";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useSelect, setSelections } from "../../selections";
import { hideControlBox, updateControlBox } from "../../controlBox";
import {
  useSelectionBox,
  updateSelectionBox,
  hideSelectionBox
} from "../../selectionBox";
import { getScrollPosition } from "../../getScrollPosition";
import { multiple } from "../../math/frame";
import { DeepReadonly } from "../../utilType";

const InternalConvasContainer: FC<{
  dispatch: (action: any) => any;
  elements: ReadonlyArray<Element>;
  selections: ReadonlyArray<Element>;
  controlBox: {
    frame: Frame;
    angle: number;
    show: boolean;
  };
  resizeKeepAspectRatio: boolean;
  zoom: number;
  children: (controlBox: ReactElement<any>) => ReactNode;
}> = ({
  dispatch,
  elements,
  selections,
  controlBox,
  resizeKeepAspectRatio,
  zoom,
  children
}) => {
  // hooks
  const { selectMouseDown, selectMouseMove, selectMouseUp } = useSelect(
    dispatch,
    event =>
      (event.target as HTMLElement).classList.contains("canvas") ||
      (event.target as HTMLElement).classList.contains("page__elements"),
    selections.map(({ id }) => id),
    {
      onDeselect() {
        dispatch(hideControlBox());
      }
    }
  );

  const {
    doubleClickMouseDown,
    doubleClickMouseMove,
    doubleClickMouseUp
  } = useDoubleClick(id => {
    emit("doubleClick", { id });
  });

  const { dragMouseDown, dragMouseMove, dragMouseUp } = useDragAndDrop(
    event => Boolean((event.target as HTMLElement).closest(".element")),
    selections,
    controlBox.frame,
    {
      zoom,
      onDrag({ elements, controlBoxPosition }) {
        dispatch(updateElements(elements));
        dispatch(
          updateControlBox({
            frame: { ...controlBox.frame, ...controlBoxPosition }
          })
        );
      }
    }
  );

  const controlBoxRef = useRef<HTMLElement>(null);
  const getOffset = () => {
    const offsetParent = controlBoxRef.current!.offsetParent;
    const rect = offsetParent!.getBoundingClientRect();
    const scrollPosition = getScrollPosition();

    return {
      x: rect.left + scrollPosition.left,
      y: rect.top + scrollPosition.top
    };
  };

  const { rotateMouseDown, rotateMouseMove, rotateMouseUp } = useRotate(
    selections,
    controlBox.frame,
    controlBox.angle,
    {
      zoom,
      getOffset,
      onRotate({ elements, controlBoxAngle }) {
        dispatch(updateElements(elements));
        dispatch(
          updateControlBox({
            angle: controlBoxAngle
          })
        );
      }
    }
  );

  const { resizeMouseDown, resizeMouseMove, resizeMouseUp } = useResize(
    selections,
    controlBox.frame,
    controlBox.angle,
    resizeKeepAspectRatio,
    {
      zoom,
      getOffset,
      onResizeStart({ elements, position }) {
        for (let i = 0; i < elements.length; i++) {
          emit("resizeStart", {
            id: elements[i].id,
            position: position
          });
        }
      },
      onResize({ elements, controlBoxFrame, position }) {
        dispatch(updateElements(elements));
        dispatch(
          updateControlBox({
            frame: controlBoxFrame
          })
        );

        for (let i = 0; i < elements.length; i++) {
          emit("resize", {
            id: elements[i].id,
            position: position,
            frame: elements[i].frame
          });
        }
      },
      onResizeEnd({ elements, position }) {
        for (let i = 0; i < elements.length; i++) {
          emit("resizeEnd", {
            id: elements[i].id,
            position: position
          });
        }
      }
    }
  );

  const {
    selectBoxMouseDown,
    selectBoxMouseMove,
    selectBoxMouseUp
  } = useSelectionBox(
    event =>
      (event.target as HTMLElement).classList.contains("canvas") ||
      (event.target as HTMLElement).classList.contains("page__elements"),
    elements,
    {
      zoom,
      getOffset(page) {
        const pageElement = document.querySelector(
          `.page[data-id="${page}"]`
        ) as HTMLElement;
        const rect = pageElement.getBoundingClientRect();
        const scrollPosition = getScrollPosition();

        return {
          x: rect.left + scrollPosition.left,
          y: rect.top + scrollPosition.top
        };
      },
      onSelectEnd(selectedElements) {
        dispatch(setSelections(selectedElements));
        dispatch(hideSelectionBox());
      },
      onSelect({ frame }) {
        dispatch(updateSelectionBox(frame));
      }
    }
  );

  const resizeHandlerPosition = selections.length > 1 ? "corner" : "all";
  const controlBoxElement = (
    <ControlBox
      ref={controlBoxRef}
      frame={multiple(controlBox.frame, zoom)}
      angle={controlBox.angle}
      resizeHandlerPosition={resizeHandlerPosition}
      onRotateMouseDown={rotateMouseDown}
      onResizeMouseDown={resizeMouseDown}
    />
  );

  // canvas
  return (
    <div
      className="canvas"
      onMouseDown={useCallback(event => {
        selectBoxMouseDown(event);
        dragMouseDown(event);
        selectMouseDown(event);
        doubleClickMouseDown(event);
      }, [])}
      onMouseMove={useCallback(event => {
        dragMouseMove(event);
        selectMouseMove(event);
        rotateMouseMove(event);
        resizeMouseMove(event);
        selectBoxMouseMove(event);
        doubleClickMouseMove(event);
      }, [])}
      onMouseUp={useCallback(event => {
        dragMouseUp(event);
        selectMouseUp(event);
        rotateMouseUp(event);
        resizeMouseUp(event);
        selectBoxMouseUp(event);
        doubleClickMouseUp(event);
      }, [])}
    >
      {children(controlBoxElement)}
    </div>
  );
};

export const CanvasContainer = memo(InternalConvasContainer);

CanvasContainer.displayName = "CanvasContainer";

type Frame = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type Element = DeepReadonly<{
  id: number;
  frame: Frame;
  angle: number;
  page: number;
}>;
