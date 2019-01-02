import Victor from "victor";
import { sizeOfRectVertices } from "../math/frame";
import { verticesOfElement } from "../element";
import {
  UPDATE_CONTROL_BOX,
  SHOW_CONTROL_BOX,
  HIDE_CONTROL_BOX
} from "./actions";
import { SET_SELECTIONS } from "../selections";

export const reducer = (state, action) => {
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
