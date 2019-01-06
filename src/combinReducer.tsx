export const combineReducers = reducers => {
  const reducerKeys = Object.keys(reducers);

  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = {};
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
            const states = reducer.getStates
              ? reducer.getStates(state)
              : undefined;
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
