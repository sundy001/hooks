export const UPDATE_CONTROL_BOX = "UPDATE_CONTROL_BOX";
export const SHOW_CONTROL_BOX = "SHOW_CONTROL_BOX";
export const HIDE_CONTROL_BOX = "HIDE_CONTROL_BOX";

export const updateControlBox = props => ({
  type: UPDATE_CONTROL_BOX,
  ...props
});

export const showControlBox = () => ({
  type: SHOW_CONTROL_BOX
});

export const hideControlBox = () => ({
  type: HIDE_CONTROL_BOX
});
