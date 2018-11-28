let canvas = null;

const dots = [];

export const init = () => {
  canvas = document.createElement("canvas");
  canvas.setAttribute("width", "1273");
  canvas.setAttribute("height", "4000");
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";

  document.getElementById("root").appendChild(canvas);

  window.requestAnimationFrame(draw);
};

export const drawDot = v => {
  dots.push(v);
};

export const removeDot = v => {
  const index = dots.findIndex(v);
  dots.splice(index, 1);
};

export const clearDot = () => {
  dots.length = 0;
};

export const drawLine = (v1, v2) => {};

const draw = () => {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < dots.length; i++) {
    if (dots[i].color) {
      context.fillStyle = dots[i].color;
    } else {
      context.fillStyle = "rgba(255, 0, 0, 1)";
    }
    context.beginPath();
    context.arc(dots[i].x, dots[i].y, 3, 0, 2 * Math.PI, true);
    context.fill();
  }

  window.requestAnimationFrame(draw);
};
