export type Action<T extends String> = {
  type: T;
};

export type ActionWithPayload<T extends String, P> = {
  payload: P;
} & Action<T>;

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(
  type: T,
  payload: P
): ActionWithPayload<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
  return payload === undefined ? { type } : { type, payload };
}
