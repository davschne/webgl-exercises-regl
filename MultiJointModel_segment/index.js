import {
  Matrix4,
  Vector3,
} from '../lib/cuon-matrix.js';

import { faces } from './faces.js';
import {
  createFullScreenCanvas,
  fetchShaderSource,
} from '../util.js';

const BLACK = [0, 0, 0, 1];
const ROBOT_COLOR = [1, 0.4, 0];
const LIGHT_DIRECTION = new Vector3([0, 0.5, 0.7]).normalize().elements;

// regl context using full-screen canvas
const canvas = createFullScreenCanvas();
const regl = createREGL(canvas);

const ANGLE_STEP = 3;

var armAngle = 90;
var forearmAngle = 45;
var wristAngle = 0;
var fingerAngle = 0;

var viewProjMatrix = new Matrix4()
  .setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0)
  .lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

function inverseTranspose(matrix) {
  return new Matrix4(matrix).invert().transpose();
}

(async function main() {
  const [vert, frag] = await Promise.all(['vert.glsl', 'frag.glsl'].map(fetchShaderSource));

  const drawSegment = regl({
    vert,
    frag,
    uniforms: {
      u_MvpMatrix: (_, { modelMatrix }) => new Matrix4(viewProjMatrix).multiply(modelMatrix).elements,
      u_NormalMatrix: (_, { modelMatrix }) => inverseTranspose(modelMatrix).elements,
      u_Color: ROBOT_COLOR,
      u_LightDirection: LIGHT_DIRECTION,
    },
    attributes: {
      a_Position: faces.map(face => face.positions),
      a_Normal: faces.map(face => face.normals),
    },
    elements: faces.map(face => face.indices),
  });

  function drawArm() {
    const baseMatrix = new Matrix4().setTranslate(0, -12, 0);
    drawSegment({ // base
      modelMatrix: new Matrix4(baseMatrix).scale(10, 2, 10)
    });

    const armMatrix = new Matrix4(baseMatrix)
      .translate(0, 2, 0)
      .rotate(armAngle, 0, 1, 0);
    drawSegment({ // arm
      modelMatrix: new Matrix4(armMatrix).scale(3, 10, 3)
    });

    const forearmMatrix = new Matrix4(armMatrix)
      .translate(0, 10, 0)
      .rotate(forearmAngle, 0, 0, 1);
    drawSegment({ // forearm
      modelMatrix: new Matrix4(forearmMatrix).scale(4, 10, 4)
    });

    const handMatrix = new Matrix4(forearmMatrix)
      .translate(0, 10, 0)
      .rotate(wristAngle, 0, 1, 0);
    drawSegment({ // hand
      modelMatrix: new Matrix4(handMatrix).scale(2, 2, 6)
    });

    const finger1Matrix = new Matrix4(handMatrix)
      .translate(0, 2, 2)
      .rotate(fingerAngle, 1, 0, 0);
    drawSegment({ // finger
      modelMatrix: new Matrix4(finger1Matrix).scale(1, 2, 1)
    });

    const finger2Matrix = new Matrix4(handMatrix)
      .translate(0, 2, -2)
      .rotate(-fingerAngle, 1, 0, 0);
    drawSegment({ // finger
      modelMatrix: new Matrix4(finger2Matrix).scale(1, 2, 1)
    });
  }

  function draw() {
    regl.clear({ color: BLACK });
    drawArm();
  }

  function keydown(ev) {
    switch (ev.keyCode) {
      case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
        armAngle = (armAngle + ANGLE_STEP) % 360;
        break;
      case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
        armAngle = (armAngle - ANGLE_STEP) % 360;
        break;
      case 40: // Up arrow key -> the positive rotation of joint1 around the z-axis
        if (forearmAngle < 135.0) forearmAngle += ANGLE_STEP;
        break;
      case 38: // Down arrow key -> the negative rotation of joint1 around the z-axis
        if (forearmAngle > -135.0) forearmAngle -= ANGLE_STEP;
        break;
      case 90: // 'ｚ'key -> the positive rotation of joint2
        wristAngle = (wristAngle + ANGLE_STEP) % 360;
        break;
      case 88: // 'x'key -> the negative rotation of joint2
        wristAngle = (wristAngle - ANGLE_STEP) % 360;
        break;
      case 86: // 'v'key -> the positive rotation of joint3
        if (fingerAngle < 60.0)  fingerAngle = (fingerAngle + ANGLE_STEP) % 360;
        break;
      case 67: // 'c'key -> the nagative rotation of joint3
        if (fingerAngle > -60.0) fingerAngle = (fingerAngle - ANGLE_STEP) % 360;
        break;
      default: return; // Skip drawing at no effective action
    }
    // Draw
    draw();
  }

  document.addEventListener('keydown', keydown);

  draw();
})();
