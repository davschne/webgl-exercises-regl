import {
  Matrix4,
  Vector3,
} from '../lib/cuon-matrix.js';

import {
  createFullScreenCanvas,
  fetchShaderSource,
  getMouseWebGLCoordinates,
} from '../util.js';
import { faces } from './faces.js';

const BLACK = [0, 0, 0, 1];

// Camera settings
const EYE_POSITION = [0, 0, 7];
const LOOK_AT_COORDS = [0, 0, 0];
const UP_VECTOR = [0, 1, 0];
const VIEW_MATRIX = new Matrix4().setLookAt(...EYE_POSITION, ...LOOK_AT_COORDS, ...UP_VECTOR);

const MODEL_TRANSLATION = [0, 0.5, 0];
const MAX_ROTATION_ANGLE = 90;

// Perspective settings
const FIELD_OF_VIEW_DEGREES = 30;
const NEAR_PLANE_DISTANCE = 1;
const FAR_PLANE_DISTANCE = 100;

// Lights
const directionalLight = {
  color: [1, 1, 1],
  direction: new Vector3([0.5, 3.0, 4.0]).normalize().elements,
};
const ambientLight = [0.2, 0.2, 0.2];

function screenPositionToRotationAngle(position) {
  return 0.5 * MAX_ROTATION_ANGLE * position;
}

function getModelMatrix(yawAngle, pitchAngle) {
  const Y_AXIS = [0, 1, 0]; // for yaw
  const X_AXIS = [1, 0, 0]; // for pitch
  return new Matrix4()
    .setTranslate(...MODEL_TRANSLATION)
    .rotate(pitchAngle, ...X_AXIS)
    .rotate(yawAngle, ...Y_AXIS);
}

(async function main() {
  const canvas = createFullScreenCanvas();
  const regl = createREGL(canvas);

  const [vert, frag] = await Promise.all(['vert.glsl', 'frag.glsl'].map(fetchShaderSource));

  const drawCube = regl({
    vert,
    frag,
    attributes: {
      a_Position: faces.map(face => face.positions),
      a_Color: faces.map(face => face.colors),
      a_Normal: faces.map(face => face.normals),
    },
    uniforms: {
      u_MvpMatrix: (context, { modelMatrix }) => {
        const aspectRatio = context.drawingBufferWidth / context.drawingBufferHeight;
        const projMatrix = new Matrix4()
          .setPerspective(FIELD_OF_VIEW_DEGREES, aspectRatio, NEAR_PLANE_DISTANCE, FAR_PLANE_DISTANCE);
        return new Matrix4().set(projMatrix)
          .multiply(VIEW_MATRIX)
          .multiply(modelMatrix)
          .elements;
      },
      u_NormalMatrix: (_, { modelMatrix }) => {
        // The normal matrix is the inverse transpose of the model matrix.
        return new Matrix4()
          .setInverseOf(modelMatrix)
          .transpose()
          .elements;
      },
      u_LightColor: directionalLight.color,
      u_LightDirection: directionalLight.direction,
      u_AmbientLight: ambientLight,
    },
    elements: faces.map(face => face.indices),
  });

  function draw(modelMatrix) {
    regl.clear({ color: BLACK });
    drawCube({ modelMatrix })
  }

  draw(getModelMatrix(0, 0));

  function onMouseMove(mouseEvent) {
    const [x, y] = getMouseWebGLCoordinates(mouseEvent, canvas);
    const yawAngle = screenPositionToRotationAngle(x);
    const pitchAngle = screenPositionToRotationAngle(y);
    const modelMatrix = getModelMatrix(yawAngle, pitchAngle);
    draw(modelMatrix);
  }

  document.body.addEventListener('mousemove', onMouseMove);
})();
