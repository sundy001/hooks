import { useRef } from "react";
import { useDragAndDrop } from "./useDragAndDrop";
import { verticesOfRect } from "../math/frame";
import { verticesOfElement, createSelection } from "../element";

const normal = (v1, v2) => {
  const v = v2
    .clone()
    .subtract(v1)
    .normalize();

  // Change this vector to be perpendicular
  const x = v.x;
  v.x = v.y;
  v.y = -x;

  return v;
};

export const useSelectionBox = (
  elements,
  { shouldSelect, onDrag, onSelectEnd } = {}
) => {
  const stateRef = useRef({
    elementInfo: null,
    selectedElements: []
  });

  const getElementInfo = () => {
    const elementVertices = elements.map(element => {
      const vertices = verticesOfElement(element);

      const normals =
        element.angle === 0
          ? []
          : vertices.map((_, i) => {
              return normal(vertices[i], vertices[i === 3 ? 0 : i + 1]);
            });

      return {
        element,
        vertices,
        normals
      };
    });

    return elementVertices;
  };

  const [
    selectBoxMouseDown,
    selectBoxMouseMove,
    selectBoxMouseUp
  ] = useDragAndDrop({
    shouldDrag(event) {
      return shouldSelect ? shouldSelect(event) : true;
    },

    onDrag({ beginingX, beginingY, original: { pageX, pageY } }) {
      let { elementInfo, selectedElements } = stateRef.current;
      if (elementInfo === null) {
        elementInfo = stateRef.current.elementInfo = getElementInfo();
      }

      const { vertices: selectionVertices, size } = verticesOfRect(
        { x: beginingX, y: beginingY },
        { x: pageX, y: pageY }
      );

      selectedElements.length = 0;
      elementInfo.forEach(info => {
        const { element, vertices } = info;
        // if (element.angle === 0) {
        //   if (
        //     selectionVertices[3].x < vertices[1].x &&
        //     selectionVertices[1].x > vertices[3].x &&
        //     selectionVertices[3].y < vertices[1].y &&
        //     selectionVertices[1].y > vertices[3].y
        //   ) {
            selectedElements.push(createSelection(element));
        //   }
        // }
      });

      if (onDrag) {
        const frame = {
          x: selectionVertices[3].x,
          y: selectionVertices[3].y,
          width: size.width,
          height: size.height
        };

        onDrag({ frame, selectedElements: [...selectedElements] });
      }
    },

    onDragEnd() {
      const { selectedElements } = stateRef.current;
      if (onSelectEnd) {
        onSelectEnd([...selectedElements]);
      }

      selectedElements.length = 0;
      stateRef.current.elementInfo = null;
    }
  });

  return { selectBoxMouseDown, selectBoxMouseMove, selectBoxMouseUp };
};
