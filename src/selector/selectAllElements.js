export const selectAllElements = ({ elements }) =>
  elements.allIds.map(id => elements.byId[id]);
