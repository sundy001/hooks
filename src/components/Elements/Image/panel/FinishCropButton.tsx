import React, { memo, useCallback, FC } from "react";
import { stopCroppingImage } from "../actions";

const InternalFinishCropButton: FC<{
  dispatch: (action: any) => void;
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
