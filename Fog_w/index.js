import { Matrix4 } from '../lib/cuon-matrix.js';

import { faces } from './faces.js';
import {
  createFullScreenCanvas,
  fetchShaderSource,
} from '../util.js';

const FOG_COLOR = [0.137, 0.231, 0.423];
const EYE_POSITION = [25, 65, 35];
const LOOK_AT_POSITION = [0, 2, 0];
const UP_VECTOR = [0, 1, 0];

const canvas = createFullScreenCanvas();
const regl = createREGL(canvas);

const mvpMatrix = new Matrix4()
  .setPerspective(30, canvas.width / canvas.height, 1, 10000)
  .lookAt(...EYE_POSITION, ...LOOK_AT_POSITION, ...UP_VECTOR)
  .scale(10, 10, 10);

(async function main() {
  let fogDistance = [45, 80];

  const [vert, frag] = await Promise.all(['vert.glsl', 'frag.glsl'].map(fetchShaderSource));
  const drawCubeWithFog = regl({
    vert,
    frag,
    uniforms: {
      u_MvpMatrix: mvpMatrix.elements,
      u_FogColor: FOG_COLOR,
      u_FogDist: regl.prop('fogDistance'),
    },
    attributes: {
      a_Position: faces.map(face => face.positions),
      a_Color: faces.map(face => face.colors),
    },
    elements: faces.map(face => face.indices),
  });

  function draw() {
    regl.clear({
      color: [...FOG_COLOR, 1],
      depth: 1,
    });
    drawCubeWithFog({ fogDistance });
  }

  function handleKeyDown(event) {
    const [near, far] = fogDistance;
    switch (event.keyCode) {
      case 38:
        fogDistance = [near, far + 1];
        break;
      case 40:
        if (far > near) {
          fogDistance = [near, far - 1];
        }
        break;
      default:
        return;
    }
    draw();
  }

  document.addEventListener('keydown', handleKeyDown);

  draw();
})();
