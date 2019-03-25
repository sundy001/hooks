import { combineReducers } from "../../combinReducer";
import { UPDATE_ZOOM, Action } from "./actions";
import { elements as imageElements } from "../elements/Image";
import { reducer as selections } from "../../selections";
import { reducer as selectionBox } from "../../selectionBox";
import { reducer as elements } from "../../element";
import {
  reducer as controlBox,
  controlBoxUpdatedBySelection
} from "../../controlBox";
import { Reducer } from "../../reducer";
import { State } from "./type";

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
