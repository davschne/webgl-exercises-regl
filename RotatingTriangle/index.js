const BLACK = [0, 0, 0, 1];
const RED = [1, 0, 0, 1];
const ANGLE_STEP_DEGREES = 45; // per second
const vertices = [
  [0, 0.5, 0, 1],
  [-0.5, -0.5, 0, 1],
  [0.5, -0.5, 0, 1],
];
let currentTime = 0;
let currentAngle = 0;

async function fetchShaderSource(filename) {
  const response = await fetch(filename);
  return response.text();
}

(async function main() {
  const canvas = document.getElementById('webgl');
  const regl = createREGL(canvas);

  const [vert, frag] = await Promise.all(['vert.glsl', 'frag.glsl'].map(fetchShaderSource));

  function getRotationAngle(currentAngle, elapsedTime) {
    return currentAngle + ANGLE_STEP_DEGREES * elapsedTime % 360;
  }

  const draw = regl({
    vert,
    frag,
    count: vertices.length,
    uniforms: {
      u_ModelMatrix: regl.prop('modelMatrix'),
      u_Color: RED,
    },
    attributes: { a_Position: vertices },
  });

  regl.frame(function drawFrame({ time }) {
    const elapsedTime = time - currentTime;
    const newAngle = getRotationAngle(currentAngle, elapsedTime);
    currentTime = time;
    currentAngle = newAngle;
    const modelMatrix = new Matrix4().setRotate(currentAngle, 0, 0, 1).elements;

    regl.clear({ color: BLACK });
    draw({ modelMatrix });
  });
})();
