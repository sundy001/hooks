import { EntityStore } from "../reducer";

export type State<P> = EntityStore<{ id: number } & P>;
