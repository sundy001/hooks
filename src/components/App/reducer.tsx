import { combineReducers } from "../../combinReducer";
import {
  UPDATE_ELEMENT,
  UPDATE_ELEMENTS,
  COPY_ELEMENTS,
  DELETE_ELEMENTS,
  UPDATE_ZOOM
} from "./actions";
import { reducer as selections } from "../../selections";
import { elements as imageElements, raise } from "../elements/Image";
import { reducer as selectionBox } from "../../selectionBox";
import {
  reducer as controlBox,
  controlBoxUpdatedBySelection
} from "../../controlBox";
import { updateEntity, updateEntities } from "../../updateEntity";
import cloneDeep from "lodash/cloneDeep";

export const elements = (state, action) => {
  switch (action.type) {
    case UPDATE_ELEMENT:
      const { id, props } = action.payload;
      return updateEntity(state, () => props, id);

    case UPDATE_ELEMENTS:
      return updateEntities(
        state,
        action.payload,
        (previouseState, newValue) => {
          let nextState = null;

          if (newValue.frame) {
            if (nextState === null) {
              nextState = { ...previouseState };
            }
            nextState.frame = newValue.frame;
          }
          if (newValue.angle) {
            if (nextState === null) {
              nextState = { ...previouseState };
            }
            nextState.angle = newValue.angle;
          }

          return nextState === null ? previouseState : nextState;
        }
      );

    case DELETE_ELEMENTS:
      if (action.payload.length === 0) {
        return state;
      }

      const byId = {};
      const allIds = [];
      Object.keys(state.byId).forEach(id => {
        if (action.payload.indexOf(id) !== -1) {
          return;
        }
        byId[id] = state.byId[id];
      });

      state.allIds.forEach(id => {
        if (action.payload.indexOf(id) !== -1) {
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

export const zoom = (state = 1, action) => {
  switch (action.type) {
    case UPDATE_ZOOM:
      return action.payload;
    default:
      return state;
  }
};

export const reducer = combineReducers({
  elements: [
    elements,
    imageElements,
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
  raise,
  pages: s => s,
  zoom
});
