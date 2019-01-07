import Victor from "victor";
import { sizeOfRectVertices } from "../math/frame";
import { transform } from "../math/affineTransformation";
import { CORNER_INDEXES, vertexOfOriginRect } from "../math/rect";
import {
  UPDATE_CONTROL_BOX,
  SHOW_CONTROL_BOX,
  HIDE_CONTROL_BOX,
  UPDATE_CONTROL_BOX_BY_ELEMENT
} from "./actions";
import { SET_SELECTIONS, CLEAR_SELECTIONS } from "../selections";

export const reducer = (
  state = {
    show: false,
    angle: 0,
    frame: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  },
  action
) => {
  switch (action.type) {
    case UPDATE_CONTROL_BOX:
      return {
        ...state,
        angle: action.angle !== undefined ? action.angle : state.angle,
        frame: action.frame !== undefined ? action.frame : state.frame
      };

    case SHOW_CONTROL_BOX:
      return {
        ...state,
        show: true
      };
    case CLEAR_SELECTIONS:
    case HIDE_CONTROL_BOX:
      return {
        ...state,
        show: false
      };
    default:
      return state;
  }
};

export const controlBoxUpdatedBySelection = (controlBox, elements, action) => {
  switch (action.type) {
    case UPDATE_CONTROL_BOX_BY_ELEMENT:
      const { frame, angle } = elements.byId[action.element];
      return {
        show: controlBox.show,
        frame: { ...frame },
        angle
      };

    case SET_SELECTIONS:
      switch (action.selections.length) {
        case 0:
          return { ...controlBox, show: false };

        case 1:
          const { frame, angle } = elements.byId[action.selections[0]];
          return {
            show: true,
            frame: { ...frame },
            angle
          };

        default:
          // TODO: support different mode of cross page selection
          // const targetPage = action.selections[0].page;
          // const filteredElements = [];
          // for (let i = 0; i < action.selections.length; i++) {
          //   const element = elements.byId[action.selections[i]];
          //   if (element.page === targetPage) {
          //     filteredElements.push(element);
          //   }
          // }

          const { min, max } = minMaxVerticesOfSelections(
            action.selections.map(id => elements.byId[id])
          );
          const { width, height } = sizeOfRectVertices(min, max);

          return {
            show: true,
            frame: { x: min.x, y: min.y, width, height },
            angle: 0
          };
      }
    default:
      return controlBox;
  }
};

const minMaxVerticesOfSelections = elements => {
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;
  elements.forEach(element => {
    verticesOfElement(element).forEach(({ x, y }) => {
      if (x < minX) {
        minX = x;
      }
      if (x > maxX) {
        maxX = x;
      }
      if (y < minY) {
        minY = y;
      }
      if (y > maxY) {
        maxY = y;
      }
    });
  });

  return { min: new Victor(minX, minY), max: new Victor(maxX, maxY) };
};

const verticesOfElement = ({ frame, angle }) =>
  CORNER_INDEXES.map(index =>
    transform(
      vertexOfOriginRect(index, frame.width, frame.height),
      frame,
      angle
    )
  );
