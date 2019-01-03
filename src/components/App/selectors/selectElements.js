export const selectElements = ({ elements: { allIds, byId }, raise }) => {
  const elements = [];
  const raisedElements = [];

  for (let i = 0; i < allIds.length; i++) {
    const id = allIds[i];
    if (raise.length > 0 && raise.indexOf(id) !== -1) {
      raisedElements.push(byId[id]);
    } else {
      elements.push(byId[id]);
    }
  }

  return elements.concat(raisedElements);
};
