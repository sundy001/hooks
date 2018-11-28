import { useMemo } from "react";

export const useAllEntities = entityStore => {
  return useMemo(() => entityStore.allIds.map(id => entityStore.byId[id]), [
    entityStore
  ]);
};
