import React, { FC, memo, useCallback } from "react";
import { startCroppingImage } from "../actions";
import { Dispatch } from "../../../../reducer";
import { hideControlBox } from "../../../../controlBox";

const InternalCropButton: FC<{ dispatch: Dispatch; id: number }> = ({
  dispatch,
  id
}) => (
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
