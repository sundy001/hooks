import React, { memo, useCallback } from "react";
import { stopCroppingImage } from "../../../Canvas/CanvasAction";

export const FinishCropButton = memo(({ dispatch, id }) => (
  <button
    onClick={useCallback(() => {
      dispatch(stopCroppingImage(id));
    }, [])}
  >
    End
  </button>
));
