import { fetchShaderSource } from '../util.js';

const RED = [1, 0, 0, 1];
const GREEN = [0, 1, 0, 1];
const BLUE = [0, 0, 1, 1];
const BLACK = [0, 0, 0, 1];

const vertices = [
  {
    position: [0, 0.5],
    color: RED,
  },
  {
    position: [-0.5, -0.5],
    color: GREEN,
  },
  {
    position: [0.5, -0.5],
    color: BLUE,
  },
];

(async function main() {
  const canvas = document.getElementById('webgl');
  const regl = createREGL(canvas);
  const [vert, frag] = await Promise.all(['vert.glsl', 'frag.glsl'].map(fetchShaderSource));

  const draw = regl({
    vert,
    frag,
    count: vertices.length,
    attributes: {
      a_Position: vertices.map(vertex => vertex.position),
      a_Color: vertices.map(vertex => vertex.color),
    },
  });

  regl.clear({ color: BLACK });
  draw();
})();
