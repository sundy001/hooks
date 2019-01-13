export const UPDATE_SELECTION_BOX = "UPDATE_SELECTION_FRAME";
export const HIDE_SELECTION_BOX = "HIDE_SELECTION_BOX";

export const updateSelectionBox = (frame: Frame) => ({
  type: UPDATE_SELECTION_BOX,
  frame
});

export const hideSelectionBox = () => ({
  type: HIDE_SELECTION_BOX
});

type Frame = {
  width: number;
  height: number;
  x: number;
  y: number;
};
