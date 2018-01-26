import { fetchShaderSource } from '../util.js';

const RED = [1, 0, 0, 1];
const GREEN = [0, 1, 0, 1];
const WHITE = [1, 1, 1, 1];
const BLACK = [0, 0, 0, 1];

(async function main() {
  const canvas = document.getElementById('webgl');
  const regl = createREGL(canvas);
  const points = [];

  const [vert, frag] = await Promise.all(['vert.glsl', 'frag.glsl'].map(fetchShaderSource));

  const drawPoint = regl({
    vert,
    frag,
    primitive: 'points',
    count: 1,
    uniforms: { u_FragColor: regl.prop('color') },
    attributes: { a_Position: regl.prop('position') },
  });

  function drawPoints(points) {
    regl.clear({ color: BLACK });
    for (const { position, color } of points) {
      drawPoint({ position, color });
    }
  }

  function getColorByPosition(x, y) {
    if (x >= 0 && y >= 0) {
      return RED;
    } else if (x < 0 && y < 0) {
      return GREEN;
    } else {
      return WHITE;
    }
  }

  canvas.addEventListener('click', function onClick({ clientX, clientY, target }) {
    const {
      width,
      height,
    } = canvas;

    const {
      left,
      right,
      top,
    } = target.getBoundingClientRect();
    const x = 2 * ((clientX - left) - width * 0.5) / width;
    const y = 2 * (height * 0.5 - (clientY - top)) / height;

    points.push({ position: [x, y, 0, 1], color: getColorByPosition(x, y) });

    drawPoints(points);
  });

  regl.clear({ color: BLACK });
})();
