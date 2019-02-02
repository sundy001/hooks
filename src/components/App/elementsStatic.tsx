import { ReactNode } from "react";
import { ElementEntity } from "./type";

export const elementsStatic: {
  [elementKey: string]: {
    getComponentsOfPanel?: (
      dispatch: (action: unknown) => void,
      element: ElementEntity,
      originalComponents: ReactNode[]
    ) => ReactNode[];
    shouldKeepAspectRatio?: boolean;
  };
} = {};
