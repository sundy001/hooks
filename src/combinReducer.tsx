import { Reducer } from "./reducer";

export const combineReducers: (
  reducers: {
    [key: string]:
      | Reducer<any, any>
      | ReadonlyArray<
          | Reducer<any, any>
          | {
              getStates: (state: any) => any[];
              reduce: (...props: any[]) => any;
            }
        >;
  }
) => any = reducers => {
  const reducerKeys = Object.keys(reducers);

  return function combination(state: any = {}, action: any) {
    let hasChanged = false;
    const nextState: any = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const value = reducers[key];

      const previousStateForKey = state[key];

      let nextStateForKey;
      if (typeof value === "function") {
        nextStateForKey = value(previousStateForKey, action);
      } else {
        const reducers = value;
        for (let i = 0; i < reducers.length; i++) {
          const reducer = reducers[i];
          if (typeof reducer === "function") {
            nextStateForKey = reducer(previousStateForKey, action);
          } else {
            const states = reducer.getStates ? reducer.getStates(state) : [];
            nextStateForKey = reducer.reduce(
              previousStateForKey,
              ...states,
              action
            );
          }

          if (nextStateForKey !== previousStateForKey) {
            break;
          }
        }
      }

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
};
