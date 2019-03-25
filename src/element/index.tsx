import { State as _State } from "./type";

export { addElements, updateElements, deleteElements } from "./actions";
export { reducer } from "./reducer";
export type State<P> = _State<P>;
