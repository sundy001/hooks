import React from "react";
import { Action } from "./actions";
import { CropButton } from "./panel/CropButton";
import { FinishCropButton } from "./panel/FinishCropButton";
import { hideControlBox } from "../../../controlBox";

export const elementStatic = {
  shouldKeepAspectRatio: true,
  getComponentsOfPanel(
    dispatch: (action: Action | ReturnType<typeof hideControlBox>) => void,
    element: Readonly<{ isCropping: boolean; id: number }>,
    originalComponents: ReadonlyArray<any>
  ) {
    if (element.isCropping) {
      return [
        <FinishCropButton
          key="finish-crop"
          dispatch={dispatch}
          id={element.id}
        />
      ];
    } else {
      return [
        ...originalComponents,
        <CropButton key="crop" dispatch={dispatch} id={element.id} />
      ];
    }
  }
};
