import { State, ElementEntity } from "../type";
import { DeepReadonlyArray } from "../../../utilType";

export const selectElements = ({
  elements: { allIds, byId },
  raise
}: State): DeepReadonlyArray<ElementEntity> => {
  const elements = [];
  const raisedElements = [];

  for (let i = 0; i < allIds.length; i++) {
    const element = byId[allIds[i]];
    if (raise.length > 0 && raise.indexOf(element.id) !== -1) {
      raisedElements.push(element);
    } else {
      elements.push(element);
    }
  }

  return elements.concat(raisedElements);
};
