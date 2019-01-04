import { combineReducers } from "../../combinReducer";
import {
  UPDATE_ELEMENT,
  UPDATE_ELEMENTS,
  COPY_ELEMENTS,
  DELETE_ELEMENTS,
  UPDATE_PAGE_OFFSETS
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
      const { type: _, id, ...props } = action;

      return updateEntity(state, () => props, id);
    case UPDATE_ELEMENTS:
      return updateEntities(
        state,
        action.elements,
        (previouseState, newValue) => {
          const nextState = { ...previouseState };

          if (newValue.frame) {
            nextState.frame = newValue.frame;
          }
          if (newValue.angle) {
            nextState.angle = newValue.angle;
          }

          return nextState;
        }
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

export const pageOffsets = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PAGE_OFFSETS:
      return action.offsets;
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
      getStates({ elements, pageOffsets }) {
        return [elements, pageOffsets];
      },
      reduce: controlBoxUpdatedBySelection
    }
  ],
  selectionBox,
  raise,
  pages: s => s,
  pageOffsets
});
