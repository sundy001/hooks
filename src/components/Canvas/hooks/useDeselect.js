import { useDeselect } from "../../../hooks/useDeselect";
import { clearSelection } from "../CanvasAction";

export default dispatch => {
  return useDeselect(
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
