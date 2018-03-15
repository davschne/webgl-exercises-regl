import { Matrix4 } from '../lib/cuon-matrix.js';

import {
  createFullScreenCanvas,
  fetchShaderSource,
  getMouseCanvasCoordinates,
} from '../util.js';

import { faces } from './faces.js';

const BLACK = [0, 0, 0, 1];
const ANGLE_STEP_DEGREES = 20;

const canvas = createFullScreenCanvas();
const regl = createREGL({
  canvas,
  attributes: { preserveDrawingBuffer: true },
});

let lastTime = regl.now();
let lastAngle = 0;
let selectedFace = 1;

const viewProjMatrix = new Matrix4()
  .setPerspective(30, canvas.width / canvas.height, 1, 100)
  .lookAt(0, 0, 7, 0, 0, 0, 0, 1, 0);

function getMvpMatrix() {
  const currentAngle = getRotationAngle();
  return new Matrix4(viewProjMatrix)
    .rotate(currentAngle, 1, 0, 0)
    .rotate(currentAngle, 0, 1, 0)
    .rotate(currentAngle, 0, 0, 1)
    .elements;
}

function getRotationAngle() {
  const elapsedTime = getElapsedTime();
  const currentAngle = (lastAngle + ANGLE_STEP_DEGREES * elapsedTime) % 360;
  lastAngle = currentAngle;
  return currentAngle;
}

function getElapsedTime() {
  const currentTime = regl.now();
  const elapsedTime = currentTime - lastTime;
  lastTime = currentTime;
  return elapsedTime;
}

(async function main() {
  const [vert, frag] = await Promise.all(['vert.glsl', 'frag.glsl'].map(fetchShaderSource));

  const drawCube = regl({
    vert,
    frag,
    uniforms: {
      u_MvpMatrix: () => getMvpMatrix(),
      u_PickedFace: regl.prop('selectedFace'),
    },
    attributes: {
      a_Position: faces.map(face => face.positions),
      a_Color: faces.map(face => face.colors),
      a_Face: faces.map(face => face.face),
    },
    elements: faces.map(face => face.indices),
  });

  function draw(selectedFace) {
    regl.clear({
      color: BLACK,
      depth: 1,
    });
    drawCube({ selectedFace });
  }

  canvas.addEventListener('mousedown', function mousedown(event) {
    const [mouseX, mouseY] = getMouseCanvasCoordinates(event);
    selectFaceAtCoordinates(mouseX, mouseY);
  });

  function selectFaceAtCoordinates(x, y) {
    draw(0);
    const [_, __, ___, faceIndex] = regl.read({
      x, y,
      width: 1,
      height: 1,
    });
    selectedFace = faceIndex;
  }

  regl.frame(function drawFrame() {
    draw(selectedFace);
  });
})();
