import React, { FC, memo, useCallback } from "react";
import { startCroppingImage, Action } from "../actions";
import { hideControlBox } from "../../../../controlBox";

const InternalCropButton: FC<{
  dispatch: (action: Action | ReturnType<typeof hideControlBox>) => void;
  id: number;
}> = ({ dispatch, id }) => (
  <button
    onClick={useCallback(() => {
      dispatch(startCroppingImage(id));
      dispatch(hideControlBox());
    }, [])}
  >
    Crop
  </button>
);

export const CropButton = memo(InternalCropButton);

CropButton.displayName = "CropButton";
