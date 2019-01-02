import { combineReducers } from "../../combinReducer";
import {
  UPDATE_CONTROL_BOX,
  UPDATE_ELEMENT,
  UPDATE_SELECTION_BOX,
  COPY_ELEMENTS,
  DELETE_ELEMENTS,
  START_CROPPING_IMAGE,
  STOP_CROPPING_IMAGE,
  UPDATE_CROPPING_IMAGE
} from "./CanvasAction";
import {
  SET_SELECTIONS,
  CLEAR_SELECTIONS,
  reducer as selections
} from "../../selections";
import { updateEntity } from "../../updateEntity";
import { sizeOfRectVertices } from "../../math/frame";
import Victor from "victor";
import cloneDeep from "lodash/cloneDeep";
import { verticesOfElement } from "../../element";

export const elements = (state, action) => {
  switch (action.type) {
    case UPDATE_ELEMENT:
      const { type: _, id, ...props } = action;

      return updateEntity(state, () => props, id);

    case START_CROPPING_IMAGE:
      return updateEntity(
        state,
        () => ({
          isCropping: true
        }),
        action.element
      );

    case STOP_CROPPING_IMAGE:
      return updateEntity(
        state,
        () => ({
          isCropping: false
        }),
        action.element
      );

    case UPDATE_CROPPING_IMAGE:
      return updateEntity(
        state,
        () => ({
          frame: action.frame,
          imageFrame: action.imageFrame
        }),
        action.element
      );

    case DELETE_ELEMENTS:
      const byId = {};
      const allIds = [];
      Object.keys(state.byId).forEach(id => {
        if (action.elements.indexOf(id) !== -1) {
          return;
        }
        byId[id] = state.byId[id];
      });

      state.allIds.forEach(id => {
        if (action.elements.indexOf(id) !== -1) {
          return;
        }
        allIds.push(id);
      });

      return {
        byId,
        allIds
      };
    default:
      return state;
  }
};

export const controlBox = (state, action) => {
  switch (action.type) {
    case UPDATE_CONTROL_BOX:
    case UPDATE_CROPPING_IMAGE:
      return {
        ...state,
        angle: action.angle !== undefined ? action.angle : state.angle,
        frame: action.frame !== undefined ? action.frame : state.frame
      };
    case STOP_CROPPING_IMAGE:
      return {
        ...state,
        show: true
      };
    case DELETE_ELEMENTS:
    case START_CROPPING_IMAGE:
    case CLEAR_SELECTIONS:
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

export const raise = (state, action) => {
  switch (action.type) {
    case START_CROPPING_IMAGE:
      return [action.element];
    case STOP_CROPPING_IMAGE:
      return [];
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

export const copySelectedElements = (elements, selections, action) => {
  switch (action.type) {
    case COPY_ELEMENTS:
      if (selections.length === 0) {
        return elements;
      }

      let lastId = Math.max(...elements.allIds);

      const byId = { ...elements.byId };
      const allIds = [...elements.allIds];
      selections.forEach(id => {
        const newElement = cloneDeep(elements.byId[id]);
        newElement.id = ++lastId;
        newElement.frame.x += 20;
        newElement.frame.y += 20;

        byId[newElement.id] = newElement;
        allIds.push(newElement.id);
      });

      return {
        byId,
        allIds
      };
    default:
      return elements;
  }
};

export const reducer = combineReducers({
  elements: [
    elements,
    {
      getStates({ elements, selections }) {
        return [elements, selections];
      },
      reduce: copySelectedElements
    }
  ],
  selections,
  controlBox: [
    controlBox,
    {
      getStates({ controlBox, elements }) {
        return [controlBox, elements];
      },
      reduce: controlBoxUpdatedBySelection
    }
  ],
  selectionBox,
  raise
});
