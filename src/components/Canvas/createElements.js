import Test from "../../Test";
import React from "react";

export const createElements = (elementStore, dragMouseDown) => {
  return elementStore.allIds.map(id => {
    const { name, ...props } = elementStore.byId[id];
    // const Component = lazy(() => import(`./${name}`));

    return <Test {...props} onMouseDown={dragMouseDown} id={id} key={id} />;
  });
};
