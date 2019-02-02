import React, { memo, useCallback, FC } from "react";
import { stopCroppingImage, Action } from "../actions";

const InternalFinishCropButton: FC<{
  dispatch: (action: Action) => void;
  id: number;
}> = ({ dispatch, id }) => (
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
