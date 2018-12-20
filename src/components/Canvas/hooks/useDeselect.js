import { useDeselect as useRawDeslect } from "../../../hooks/useDeselect";
import { clearSelection } from "../CanvasAction";

export const useDeselect = dispatch => {
  return useRawDeslect(
    ({ original }) => {
      return original.target.classList.contains("canvas");
    },
    {
      onDeselect() {
        dispatch(clearSelection());
      }
    }
  );
};
