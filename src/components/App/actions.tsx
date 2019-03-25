// scale
export const UPDATE_ZOOM = "UPDATE_ZOOM";

export const updateZoom = (zoom: number) => ({
  type: UPDATE_ZOOM as typeof UPDATE_ZOOM,
  zoom
});

export type Action = ReturnType<typeof updateZoom>;
