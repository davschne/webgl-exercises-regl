import { fetchShaderSource } from '../util.js';
import triangles from './triangles.js';

const BLACK = [0, 0, 0, 1];

// Camera settings
const EYE_COORDS = [0, 0, 5];
const LOOK_AT_COORDS = [0, 0, -100];
const UP_VECTOR = [0, 1, 0];

// Perspective settings
const FIELD_OF_VIEW_DEGREES = 30;
const NEAR_PLANE_DISTANCE = 1;
const FAR_PLANE_DISTANCE = 100;

// Model matrices for the two rows of triangles
const LEFT_MODEL_MATRIX = new Matrix4().setTranslate(-0.75, 0, 0);
const RIGHT_MODEL_MATRIX = new Matrix4().setTranslate(0.75, 0, 0);

// regl context using full-screen canvas
const regl = createREGL();

const viewMatrix = new Matrix4()
  .setLookAt(...EYE_COORDS, ...LOOK_AT_COORDS, ...UP_VECTOR);

(async function main() {
  const [vert, frag] = await Promise.all(['vert.glsl', 'frag.glsl'].map(fetchShaderSource));

  const drawTriangles = regl({
    vert,
    frag,
    primitive: 'triangles',
    count: 3,
    context: {
      mvpMatrix: (context, { modelMatrix }) => {
        const aspectRatio = context.drawingBufferWidth / context.drawingBufferHeight;
        const projMatrix = new Matrix4()
          .setPerspective(FIELD_OF_VIEW_DEGREES, aspectRatio, NEAR_PLANE_DISTANCE, FAR_PLANE_DISTANCE);
        return new Matrix4().set(projMatrix).multiply(viewMatrix).multiply(modelMatrix).elements;
      }
    },
  });

  const drawTriangle = regl({
    attributes: {
      a_Position: regl.prop('position'),
      a_Color: regl.prop('color'),
    },
    uniforms: {
      u_MvpMatrix: regl.context('mvpMatrix'),
    },
  });

  const triangleProps = triangles.map(vertices => ({
    position: vertices.map(vertex => vertex.position),
    color: vertices.map(vertex => vertex.color),
  }));

  regl.clear({ color: BLACK });
  drawTriangles({ modelMatrix: RIGHT_MODEL_MATRIX }, () => {
    drawTriangle(triangleProps);
  });
  drawTriangles({ modelMatrix: LEFT_MODEL_MATRIX }, () => {
    drawTriangle(triangleProps);
  });
})();
