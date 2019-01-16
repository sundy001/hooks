import { EntityStore } from "../../reducer";
import { State as SelectionsState } from "../../selections";
import { State as ControlBoxState } from "../../controlBox";
import { State as SelectionBoxState } from "../../selectionBox";

export type State = {
  elements: EntityStore<ElementEntity>;
  pages: EntityStore<Page>;
  raise: ReadonlyArray<number>;
  zoom: number;
  selections: SelectionsState;
  controlBox: ControlBoxState;
  selectionBox: SelectionBoxState;
};

type Page = {
  id: number;
  backgroundColor: string;
  width: number;
  height: number;
};

export type ElementEntity = {
  name: string;
  id: number;
  frame: Frame;
  angle: number;
  page: number;
};

type Frame = {
  width: number;
  height: number;
  x: number;
  y: number;
};
