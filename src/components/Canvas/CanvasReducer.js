import { combineReducers } from "../../combinReducer";
import {
  UPDATE_CONTROL_BOX,
  SHOW_CONTROL_BOX,
  HIDE_CONTROL_BOX,
  UPDATE_ELEMENT,
  UPDATE_SELECTION_BOX,
  SET_SELECRIONS
} from "./CanvasAction";
import { updateEntity } from "../../updateEntity";
import { sizeOfRectVertices } from "../../math/frame";
import Victor from "victor";
import { verticesOfElement } from "../../element";

export const elements = (state, action) => {
  switch (action.type) {
    case UPDATE_ELEMENT:
      const { type: _, id, ...props } = action;

      return updateEntity(state, () => props, id);
    default:
      return state;
  }
};

export const controlBox = (state, action) => {
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

export const selectionBox = (state, action) => {
  switch (action.type) {
    case UPDATE_SELECTION_BOX:
      return action.frame;
    default:
      return state;
  }
};

export const selections = (state, action) => {
  switch (action.type) {
    case SET_SELECRIONS:
      return action.selections;
    default:
      return state;
  }
};

// TODO: extract them later
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

export const selectionBoxUpdatedBySelection = (
  state,
  action,
  selections,
  elementStore
) => {
  switch (action.type) {
    case SET_SELECRIONS:
      if (selections.length === 0) {
        return { ...state, show: false };
      }

      if (selections.length === 1) {
        const { frame, angle } = elementStore.byId[selections[0]];

        return {
          show: true,
          frame: { ...frame },
          angle
        };
      }

      const { min, max } = minMaxVerticesOfSelections(
        selections.map(id => elementStore.byId[id])
      );
      const { width, height } = sizeOfRectVertices(min, max);

      return {
        show: true,
        frame: { x: min.x, y: min.y, width, height },
        angle: 0
      };
    default:
      return state;
  }
};

export const crossSliceReducer = (state, action) => {
  switch (action.type) {
    case SET_SELECRIONS:
      return {
        ...state,
        controlBox: selectionBoxUpdatedBySelection(
          state.controlBox,
          action,
          state.selections,
          state.elements
        )
      };
    default:
      return state;
  }
};

const combinedReducer = combineReducers({
  elements,
  selections,
  controlBox,
  selectionBox
});

export const reducer = (state, action) => {
  const intermediateState = combinedReducer(state, action);
  return crossSliceReducer(intermediateState, action);
};
