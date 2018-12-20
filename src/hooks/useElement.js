// TODO: rename it, it should not belings to hook
export const useElement = ({ frame, angle, onMouseDown }) => {
  return {
    onMouseDown,
    style: {
      background: "green",
      width: `${frame.width}px`,
      height: `${frame.height}px`,
      transform: `translate(${frame.x}px, ${frame.y}px) rotate(${angle}rad)`
    }
  };
};
