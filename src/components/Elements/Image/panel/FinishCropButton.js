import React, { memo, useCallback } from "react";
import { stopCroppingImage } from "../actions";

export const FinishCropButton = memo(({ dispatch, id }) => (
  <button
    onClick={useCallback(() => {
      dispatch(stopCroppingImage(id));
    }, [])}
  >
    End
  </button>
));

FinishCropButton.displayName = "FinishCropButton";
