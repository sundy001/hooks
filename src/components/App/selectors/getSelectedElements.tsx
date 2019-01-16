import { State, ElementEntity } from "../type";
import { DeepReadonlyArray } from "../../../utilType";

export const getSelectedElements = ({
  selections,
  elements
}: State): DeepReadonlyArray<ElementEntity> =>
  selections.map(id => elements.byId[id]);
