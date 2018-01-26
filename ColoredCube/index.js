import { fetchShaderSource } from '../util.js';
import { faces } from './faces.js';

const BLACK = [0, 0, 0, 1];

// Camera settings
const EYE_COORDS = [3, 3, 7];
const LOOK_AT_COORDS = [0, 0, 0];
const UP_VECTOR = [0, 1, 0];

// Perspective settings
const FIELD_OF_VIEW_DEGREES = 30;
const NEAR_PLANE_DISTANCE = 1;
const FAR_PLANE_DISTANCE = 100;

// regl context using full-screen canvas
const regl = createREGL();

const viewMatrix = new Matrix4()
  .setLookAt(...EYE_COORDS, ...LOOK_AT_COORDS, ...UP_VECTOR);

// identity model matrix, because cube will be at the origin
const modelMatrix = new Matrix4(1);

(async function main() {
  const [vert, frag] = await Promise.all(['vert.glsl', 'frag.glsl'].map(fetchShaderSource));

  const draw = regl({
    vert,
    frag,
    attributes: {
      a_Position: faces.map(face => face.positions),
      a_Color: faces.map(face => face.colors),
    },
    uniforms: {
      u_MvpMatrix: (context) => {
        const aspectRatio = context.drawingBufferWidth / context.drawingBufferHeight;
        const projMatrix = new Matrix4()
          .setPerspective(FIELD_OF_VIEW_DEGREES, aspectRatio, NEAR_PLANE_DISTANCE, FAR_PLANE_DISTANCE);
        return new Matrix4().set(projMatrix).multiply(viewMatrix).multiply(modelMatrix).elements;
      }
    },
    elements: faces.map(face => face.indices),
  });

  regl.clear({ color: BLACK });
  draw();
})();
