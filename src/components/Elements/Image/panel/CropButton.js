import React, { memo, useCallback } from "react";
import { startCroppingImage } from "../../../Canvas/CanvasAction";

export const CropButton = memo(({ dispatch, id }) => (
  <button
    onClick={useCallback(() => {
      dispatch(startCroppingImage(id));
    }, [])}
  >
    Crop
  </button>
));
