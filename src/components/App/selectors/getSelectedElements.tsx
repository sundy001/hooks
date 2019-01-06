export const getSelectedElements = ({ selections, elements }) =>
  selections.map(id => elements.byId[id]);
