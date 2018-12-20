export const selectSelectedElements = ({ selections, elements }) =>
  selections.map(id => elements.byId[id]);
