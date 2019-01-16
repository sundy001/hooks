import { DeepReadonly } from "../utilType";

export type Action<T extends String> = {
  type: T;
};

export type ActionWithPayload<T extends String, P> = {
  payload: P;
} & Action<T>;

export type Reducer<State, Action> = (state: State, action: Action) => State;

export type EntityStore<Entity> = DeepReadonly<{
  byId: { [id: number]: Entity };
  allIds: number[];
}>;

export type Dispatch = (
  action: Action<string> | ActionWithPayload<string, any>
) => void;
