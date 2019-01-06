import React, { memo, useCallback, SFC } from "react";
import { hideControlBox } from "../../../../controlBox";
import { startCroppingImage } from "../actions";

const InternalCropButton: SFC<any> = ({ dispatch, id }) => (
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
