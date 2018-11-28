import Victor from "victor";

// reference: https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
// v, w are two ends of the line
// p is the vertex
export const minDistanceFromVertexToLine = (v, w, p) => {
  const l2 = v.distanceSq(w);
  if (l2 === 0) return p.distance(v);

  const t = Math.max(
    0,
    Math.min(
      1,
      p
        .clone()
        .subtract(v)
        .dot(w.clone().subtract(v)) / l2
    )
  );
  const projection = v.clone().add(
    w
      .clone()
      .subtract(v)
      .multiply(new Victor(t, t))
  );
  return p.distance(projection);
};
