export type Frame = Readonly<{
  width: number;
  height: number;
  x: number;
  y: number;
}>;

export type ImageEntity = {
  imageUrl: string;
  imageFrame: Frame;
  isCropping: boolean;
} & ElementEntity;

type ElementEntity = {
  id: number;
  frame: Frame;
  angle: number;
  page: number;
};
