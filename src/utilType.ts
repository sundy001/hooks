export type Primitive = string | number | boolean | undefined | null;

export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends any[]
  ? DeepReadonlyArray<T[number]>
  : T extends Function
  ? T
  : DeepReadonlyObject<T>;
type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
