import { combineReducers } from "../../combinReducer";
import {
  UPDATE_ELEMENT,
  UPDATE_ELEMENTS,
  UPDATE_SELECTION_BOX,
  COPY_ELEMENTS,
  DELETE_ELEMENTS,
  START_CROPPING_IMAGE,
  STOP_CROPPING_IMAGE,
  UPDATE_CROPPING_IMAGE
} from "./CanvasAction";
import { reducer as selections } from "../../selections";
import {
  reducer as controlBox,
  controlBoxUpdatedBySelection
} from "../../controlBox";
import { updateEntity, updateEntities } from "../../updateEntity";
import cloneDeep from "lodash/cloneDeep";

export const elements = (state, action) => {
  switch (action.type) {
    case UPDATE_ELEMENT:
      const { type: _, id, ...props } = action;

      return updateEntity(state, () => props, id);
    case UPDATE_ELEMENTS:
      return updateEntities(
        state,
        action.elements,
        (previouseState, newValue) => {
          const nextState = Object.assign({}, previouseState);

          if (newValue.position) {
            nextState.frame = Object.assign(
              {},
              previouseState.frame,
              newValue.position
            );
          } else if (newValue.frame) {
            nextState.frame = newValue.frame;
          }

          if (newValue.angle) {
            nextState.angle = newValue.angle;
          }

          return nextState;
        }
      );

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
      getStates({ selections }) {
        return [selections];
      },
      reduce: copySelectedElements
    }
  ],
  selections,
  controlBox: [
    controlBox,
    {
      getStates({ elements }) {
        return [elements];
      },
      reduce: controlBoxUpdatedBySelection
    }
  ],
  selectionBox,
  raise
});
