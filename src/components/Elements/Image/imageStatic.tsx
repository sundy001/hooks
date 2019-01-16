import React from "react";
import { CropButton } from "./panel/CropButton";
import { FinishCropButton } from "./panel/FinishCropButton";

export const elementStatic = {
  shouldKeepAspectRatio: true,
  getComponentsOfPanel(dispatch: any, element: any, originalComponents: any) {
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
