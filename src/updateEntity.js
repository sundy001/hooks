export const updateEntity = (entityStore, updater, filter = () => true) => {
  const { allIds, byId } = entityStore;
  let newByIds = null;

  if (typeof filter === "function") {
    Object.keys(byId).forEach(id => {
      if (!filter(byId[id])) {
        return;
      }

      const updatedEntity = getUpdatedEntity(id, updater, byId);
      if (updatedEntity === null) {
        return;
      }

      if (newByIds === null) {
        newByIds = { ...byId };
      }

      newByIds[id] = updatedEntity;
    });
  } else {
    const id = filter;
    const updatedEntity = getUpdatedEntity(id, updater, byId);

    if (updatedEntity !== null) {
      newByIds = {
        ...byId,
        [id]: updatedEntity
      };
    }
  }

  return newByIds === null
    ? entityStore
    : {
        allIds,
        byId: newByIds
      };
};

export const getUpdatedEntity = (id, updater, byId) => {
  const updatedField = updater(byId[id]);
  const isUpdated = Object.keys(updatedField).some(
    p => updatedField[p] !== byId[id][p]
  );
  if (!isUpdated) {
    return null;
  }

  return {
    ...byId[id],
    ...updatedField
  };
};
