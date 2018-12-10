import { useRef } from "react";
import { useDragAndDrop } from "./useDragAndDrop";
import { verticesOfRect } from "../math/frame";
import { normalizeNormal, HORIZONTAL, VERTICAL } from "../math/vector";
import { verticesOfElement, createSelection } from "../element";

// TODO: move to the right place
const projectionOfPolygron = (vertices, axis) => {
  let min = axis.dot(vertices[0]);
  let max = min;
  vertices.forEach(vertex => {
    // NOTE: the axis must be normalized to get accurate projections
    const p = axis.dot(vertex);
    if (p < min) {
      min = p;
    } else if (p > max) {
      max = p;
    }
  });

  return {
    min,
    max
  };
};

const isOverlap = (p1, p2) => p2.max >= p1.min && p1.max >= p2.min;

export const useSelectionBox = (
  elements,
  { shouldSelect, onDrag, onSelectEnd } = {}
) => {
  const stateRef = useRef({
    elementInfo: null,
    selectedElements: []
  });

  // info include element, vertices
  const getElementInfo = () => {
    const elementVertices = elements.map(element => {
      const vertices = verticesOfElement(element);

      const axes =
        element.angle === 0
          ? []
          : [
              normalizeNormal(vertices[0], vertices[1]),
              normalizeNormal(vertices[1], vertices[2])
            ];

      return {
        element,
        vertices,
        axes
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

    onDrag({ beginningX, beginningY, original: { pageX, pageY } }) {
      let { elementInfo, selectedElements } = stateRef.current;
      if (elementInfo === null) {
        elementInfo = stateRef.current.elementInfo = getElementInfo();
      }

      const { vertices: selectionVertices, size } = verticesOfRect(
        { x: beginningX, y: beginningY },
        { x: pageX, y: pageY }
      );

      selectedElements.length = 0;
      elementInfo.forEach(info => {
        const { element, vertices, axes } = info;

        let isSelected;
        if (element.angle === 0) {
          isSelected =
            selectionVertices[3].x < vertices[1].x &&
            selectionVertices[1].x > vertices[3].x &&
            selectionVertices[3].y < vertices[1].y &&
            selectionVertices[1].y > vertices[3].y;
        } else {
          // Separating Axis Theorem is used to detect rotated rectangles
          // ref: http://www.dyn4j.org/2010/01/sat/#sat-top
          // ref: https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169
          isSelected = [HORIZONTAL, VERTICAL].every(axis => {
            const p1 = projectionOfPolygron(selectionVertices, axis);
            const p2 = projectionOfPolygron(vertices, axis);
            return isOverlap(p1, p2);
          });

          if (isSelected) {
            isSelected = axes.every(axis => {
              const p1 = projectionOfPolygron(selectionVertices, axis);
              const p2 = projectionOfPolygron(vertices, axis);
              return isOverlap(p1, p2);
            });
          }
        }

        if (isSelected) {
          selectedElements.push(createSelection(element));
        }
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
