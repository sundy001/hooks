import Victor from "victor";

export const normalizeNormal = (v1: Victor, v2: Victor) => {
  const v = v2
    .clone()
    .subtract(v1)
    .normalize();

  // Change this vector to be perpendicular
  const x = v.x;
  v.x = v.y;
  v.y = -x;

  return v;
};

export const VERTICAL = new Victor(1, 0);

export const HORIZONTAL = new Victor(0, 1);
