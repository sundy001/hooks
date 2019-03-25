import {
  UPDATE_ELEMENTS,
  DELETE_ELEMENTS,
  Action,
  ADD_ELEMENTS
} from "./actions";
import { updateEntities, Reducer } from "../reducer";
import { State } from "./type";

export const reducer: Reducer<State<unknown>, Action> = (state, action) => {
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
        const byId: { [id: number]: any } = {};
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
