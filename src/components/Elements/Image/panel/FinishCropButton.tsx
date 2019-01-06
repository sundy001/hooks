import React, { memo, useCallback, SFC } from "react";
import { stopCroppingImage } from "../actions";

const InternalFinishCropButton: SFC<any> = ({ dispatch, id }) => (
  <button
    onClick={useCallback(() => {
      dispatch(stopCroppingImage(id));
    }, [])}
  >
    End
  </button>
);

export const FinishCropButton = memo(InternalFinishCropButton);

FinishCropButton.displayName = "FinishCropButton";
