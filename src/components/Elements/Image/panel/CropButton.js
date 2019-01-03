import React, { memo, useCallback } from "react";
import { hideControlBox } from "../../../../controlBox";
import { startCroppingImage } from "../actions";

export const CropButton = memo(({ dispatch, id }) => (
  <button
    onClick={useCallback(() => {
      dispatch(startCroppingImage(id));
      dispatch(hideControlBox());
    }, [])}
  >
    Crop
  </button>
));

CropButton.displayName = "CropButton";
