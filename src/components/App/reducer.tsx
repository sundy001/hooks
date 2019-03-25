import { combineReducers } from "../../combinReducer";
import {
  UPDATE_ELEMENTS,
  DELETE_ELEMENTS,
  UPDATE_ZOOM,
  Action,
  ADD_ELEMENTS
} from "./actions";
import { reducer as selections } from "../../selections";
import { elements as imageElements } from "../elements/Image";
import { reducer as selectionBox } from "../../selectionBox";
import {
  reducer as controlBox,
  controlBoxUpdatedBySelection
} from "../../controlBox";
import { updateEntities, Reducer } from "../../reducer";
import { State, ElementEntity } from "./type";

export const elements: Reducer<State["elements"], Action> = (state, action) => {
  switch (action.type) {
    case ADD_ELEMENTS:
      if (action.elements.length === 0) {
        return state;
      } else {
        const byId = { ...state.byId };
        const allIds = [...state.allIds];

        for (let i = 0; i < action.elements.length; i++) {
          const id = action.elements[i].id;
          byId[id] = action.elements[i];
          allIds.push(id);
        }

        return {
          byId,
          allIds
        };
      }

    case UPDATE_ELEMENTS:
      return updateEntities(
        state,
        action.elements,
        (previouseState, nextState) => {
          const keys = Object.keys(nextState);
          if (keys.length === 0) {
            return previouseState;
          }

          return {
            ...previouseState,
            ...nextState
          };
        }
      );

    case DELETE_ELEMENTS:
      if (action.elements.length === 0) {
        return state;
      } else {
        const byId: { [id: number]: ElementEntity } = {};
        Object.keys(state.byId).forEach(stringId => {
          const id = Number(stringId);
          if (action.elements.indexOf(id) === -1) {
            byId[id] = state.byId[id];
          }
        });

        const allIds: number[] = [];
        state.allIds.forEach(id => {
          if (action.elements.indexOf(id) === -1) {
            allIds.push(id);
          }
        });

        return {
          byId,
          allIds
        };
      }

    default:
      return state;
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
  elements: [elements, imageElements],
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
