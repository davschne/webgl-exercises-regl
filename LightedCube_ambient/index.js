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
const EYE_POSITION_INITIAL = [0, 0, 7];
const LOOK_AT_COORDS = [0, 0, 0];
const UP_VECTOR = [0, 1, 0];
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

// identity model matrix; cube at origin
const modelMatrix = new Matrix4();

function screenPositionToRotationAngle(position) {
  return 0.5 * MAX_ROTATION_ANGLE * position;
}

function getViewMatrix(yawAngle, pitchAngle) {
  const Y_AXIS = [0, 1, 0]; // for yaw
  const X_AXIS = [1, 0, 0]; // for pitch
  const rotationMatrix = new Matrix4()
    .setRotate(pitchAngle, ...X_AXIS)
    .rotate(yawAngle, ...Y_AXIS);
  const eyePosition = rotationMatrix.multiplyVector3(new Vector3(EYE_POSITION_INITIAL)).elements;
  return new Matrix4().setLookAt(...eyePosition, ...LOOK_AT_COORDS, ...UP_VECTOR);
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
      u_MvpMatrix: (context, { viewMatrix }) => {
        const aspectRatio = context.drawingBufferWidth / context.drawingBufferHeight;
        const projMatrix = new Matrix4()
          .setPerspective(FIELD_OF_VIEW_DEGREES, aspectRatio, NEAR_PLANE_DISTANCE, FAR_PLANE_DISTANCE);
        return new Matrix4().set(projMatrix)
          .multiply(viewMatrix)
          .multiply(modelMatrix)
          .elements;
      },
      u_LightColor: directionalLight.color,
      u_LightDirection: directionalLight.direction,
      u_AmbientLight: ambientLight,
    },
    elements: faces.map(face => face.indices),
  });

  function draw(viewMatrix) {
    regl.clear({ color: BLACK });
    drawCube({ viewMatrix })
  }

  draw(getViewMatrix(0, 0));

  function onMouseMove(mouseEvent) {
    const [x, y] = getMouseWebGLCoordinates(mouseEvent, canvas);
    const yawAngle = screenPositionToRotationAngle(x);
    const pitchAngle = screenPositionToRotationAngle(y);
    const viewMatrix = getViewMatrix(yawAngle, pitchAngle);
    draw(viewMatrix);
  }

  document.body.addEventListener('mousemove', onMouseMove);
})();
