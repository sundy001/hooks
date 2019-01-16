import { DeepReadonly } from "../utilType";

export type State = DeepReadonly<{
  frame: Frame;
  angle: number;
  show: boolean;
}>;

export type Frame = Readonly<{
  width: number;
  height: number;
  x: number;
  y: number;
}>;
