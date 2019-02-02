import { DeepReadonly } from "../utilType";

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type EntityStore<Entity> = DeepReadonly<{
  byId: { [id: number]: Entity };
  allIds: number[];
}>;
