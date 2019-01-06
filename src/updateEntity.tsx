export const updateEntity = (
  entityStore,
  updater,
  filter = (id: number) => true
) => {
  const { allIds, byId } = entityStore;
  let newByIds = null;

  if (typeof filter === "function") {
    const ids = Object.keys(byId);
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
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
    }
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

export const updateEntities = (entityStore, entities, updater) => {
  if (entities.length === 0) {
    return entityStore;
  }

  let newById = null;
  for (let i = 0; i < entities.length; i++) {
    const id = entities[i].id;
    const previousEntityState = entityStore.byId[id];
    const nextEntityState = updater(previousEntityState, entities[i]);

    if (previousEntityState === nextEntityState) {
      continue;
    }

    if (newById === null) {
      newById = { ...entityStore.byId };
    }

    newById[id] = nextEntityState;
  }

  return newById === null
    ? entityStore
    : {
        byId: newById,
        allIds: entityStore.allIds
      };
};
