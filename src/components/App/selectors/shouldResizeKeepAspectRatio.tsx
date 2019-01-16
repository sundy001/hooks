import { elementsStatic } from "../elementsStatic";
import { State } from "../type";

export const shouldResizeKeepAspectRatio = ({
  selections,
  elements
}: State) => {
  if (selections.length === 0) {
    return false;
  }

  if (selections.length > 1) {
    return true;
  } else {
    const id = selections[0];
    const elementStatic = elementsStatic[elements.byId[id].name];
    return elementStatic && Boolean(elementStatic.shouldKeepAspectRatio);
  }
};
