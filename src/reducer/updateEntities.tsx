import { EntityStore } from "./type";
import { DeepReadonly, DeepReadonlyArray } from "../utilType";

export const updateEntities = <T extends { id: number }, _>(
  entityStore: EntityStore<T>,
  entities: ReadonlyArray<Partial<T> & { id: number }>,
  updater: (
    previous: DeepReadonly<T>,
    entity: Partial<T> & { id: number }
  ) => DeepReadonly<T>
) => {
  if (entities.length === 0) {
    return entityStore;
  }

  let newById: { [key: string]: DeepReadonly<T> } | null = null;
  for (let i = 0; i < entities.length; i++) {
    const id = entities[i].id as number;
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
