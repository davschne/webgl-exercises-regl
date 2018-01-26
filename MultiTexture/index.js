import {
  fetchImage,
  fetchShaderSource,
} from '../util.js';

const BLACK = [0, 0, 0, 1];

const vertices = [
  {
    position: [-0.5, 0.5],
    texCoord: [0, 1],
  },
  {
    position: [-0.5, -0.5],
    texCoord: [0, 0]
  },
  {
    position: [0.5, 0.5],
    texCoord: [1, 1],
  },
  {
    position: [0.5, -0.5],
    texCoord: [1, 0],
  },
];

(async function main() {
  const canvas = document.getElementById('webgl');
  const regl = createREGL(canvas);
  const [
    vert,
    frag,
    skyImage,
    circleImage,
  ] = await Promise.all([
    fetchShaderSource('vert.glsl'),
    fetchShaderSource('frag.glsl'),
    fetchImage('sky.jpg'),
    fetchImage('circle.gif'),
  ]);

  /*
  WebGL coordinate system has Y axis going up in positive direction, whereas an Image has Y axis going down in positive direction. We must therefore flip the y-axis.
  */
  const skyTexture = regl.texture({
    data: skyImage,
    flipY: true,
  });
  const circleTexture = regl.texture({
    data: circleImage,
    flipY: true,
  });

  const draw = regl({
    vert,
    frag,
    primitive: 'triangle strip',
    count: vertices.length,
    attributes: {
      a_Position: vertices.map(vertex => vertex.position),
      a_TexCoord: vertices.map(vertex => vertex.texCoord),
    },
    uniforms: {
      u_Sampler0: skyTexture,
      u_Sampler1: circleTexture,
    },
  });

  regl.clear({ color: BLACK });
  draw();
})();
