import { combineReducers } from "../../combinReducer";
import {
  UPDATE_ELEMENT,
  UPDATE_ELEMENTS,
  COPY_ELEMENTS,
  DELETE_ELEMENTS,
  UPDATE_ZOOM,
  Action
} from "./actions";
import { reducer as selections } from "../../selections";
import { elements as imageElements } from "../elements/Image";
import { reducer as selectionBox } from "../../selectionBox";
import {
  reducer as controlBox,
  controlBoxUpdatedBySelection
} from "../../controlBox";
import { updateEntity, updateEntities, Reducer } from "../../reducer";
import cloneDeep from "lodash/cloneDeep";
import { State, ElementEntity } from "./type";

export const elements: Reducer<State["elements"], Action> = (state, action) => {
  switch (action.type) {
    case UPDATE_ELEMENT:
      const { id, props } = action;
      return updateEntity(state, () => props, id);

    case UPDATE_ELEMENTS:
      return updateEntities(
        state,
        action.elements,
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
      if (action.elements.length === 0) {
        return state;
      }

      const byId: { [id: number]: ElementEntity } = {};
      const allIds: number[] = [];
      Object.keys(state.byId).forEach(stringId => {
        const id = Number(stringId);
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

export const copySelectedElements = (
  elements: State["elements"],
  selections: State["selections"],
  action: Action
): State["elements"] => {
  switch (action.type) {
    case COPY_ELEMENTS:
      if (selections.length === 0) {
        return elements;
      }

      let lastId = Math.max(...elements.allIds);

      const byId = { ...elements.byId };
      const allIds = [...elements.allIds];
      selections.forEach(id => {
        const newElement = cloneDeep(elements.byId[id]) as ElementEntity;
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

export const zoom: Reducer<State["zoom"], Action> = (state = 1, action) => {
  switch (action.type) {
    case UPDATE_ZOOM:
      return action.zoom;
    default:
      return state;
  }
};

// TODO: move it somewhere image no loger need to rasie
export const raise: Reducer<State["raise"], Action> = (state = [], action) => {
  switch (action.type) {
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
