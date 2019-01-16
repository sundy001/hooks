import { EntityStore } from "./type";
import { DeepReadonly, DeepReadonlyArray } from "../utilType";

export const updateEntity = <T, _>(
  entityStore: EntityStore<T>,
  updater: (entity: DeepReadonly<T>) => Partial<T>,
  filter: ((entity: DeepReadonly<T>) => boolean) | number = () => true
): EntityStore<T> => {
  const { allIds, byId } = entityStore;
  let newByIds = null;

  if (typeof filter === "function") {
    const ids = Object.keys(byId);
    for (let i = 0; i < ids.length; i++) {
      const id = Number(ids[i]);
      if (!filter(byId[id])) {
        continue;
      }

      const updatedEntity = getUpdatedEntity(id, updater, byId);
      if (updatedEntity === null) {
        continue;
      }

      if (newByIds === null) {
        newByIds = { ...byId };
      }

      newByIds[id] = updatedEntity as DeepReadonly<T>;
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
    : ({
        allIds,
        byId: newByIds
      } as EntityStore<T>);
};

export const getUpdatedEntity = <T, _>(
  id: number,
  updater: (entity: DeepReadonly<T>) => Partial<T>,
  byId: EntityStore<T>["byId"]
) => {
  const updatedField = updater(byId[id]);
  const isUpdated = Object.keys(updatedField).some(
    p => (updatedField as any)[p] !== (byId[id] as any)[p]
  );
  if (!isUpdated) {
    return null;
  }

  return {
    ...byId[id],
    ...updatedField
  } as T;
};

export const updateEntities = <T extends { id: number }, _>(
  entityStore: EntityStore<T>,
  entities: any,
  updater: (
    previous: DeepReadonly<T>,
    entity: DeepReadonly<T>
  ) => DeepReadonly<T>
) => {
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
