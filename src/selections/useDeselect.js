import { useDeselect as useRawDeslect } from "../hooks/useDeselect";
import { clearSelections } from "./actions";

export const useDeselect = dispatch => {
  return useRawDeslect(
    ({ original }) => {
      return original.target.classList.contains("canvas");
    },
    {
      onDeselect() {
        dispatch(clearSelections());
      }
    }
  );
};
