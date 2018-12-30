import { elementsStatic } from "../elementsStatic";

export const shouldKeepAspectRatio = ({ selections, elements }) => {
  if (selections.length === 0) {
    return false;
  }

  if (selections.length > 1) {
    return true;
  } else {
    const id = selections[0];
    const elementStatic = elementsStatic[elements.byId[id].name];
    if (elementStatic && elementStatic.shouldKeepAspectRatio) {
      return elementStatic.shouldKeepAspectRatio;
    } else {
      return false;
    }
  }
};
