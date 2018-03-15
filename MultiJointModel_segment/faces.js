/* Create a cube
    v6----- v5
   /|      /|
  v1------v0|
  | |     | |
  | |v7---|-|v4
  |/      |/
  v2------v3
*/

const v0 = [ 0.5, 1,  0.5];
const v1 = [-0.5, 1,  0.5];
const v2 = [-0.5, 0,  0.5];
const v3 = [ 0.5, 0,  0.5];
const v4 = [ 0.5, 0, -0.5];
const v5 = [ 0.5, 1, -0.5];
const v6 = [-0.5, 1, -0.5];
const v7 = [-0.5, 0, -0.5];

function makeFace(vertices, normal, faceIndex) {
  const offset = faceIndex * 4;
  return {
    positions: vertices,
    normals: [normal, normal, normal, normal],
    indices: [[offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]],
  };
}

export const faces = [
  makeFace([v0, v1, v2, v3], [0,  0,  1], 0),  // front
  makeFace([v0, v3, v4, v5], [1,  0,  0], 1),  // right
  makeFace([v0, v5, v6, v1], [0,  1,  0], 2),  // up
  makeFace([v1, v6, v7, v2], [-1, 0,  0], 3),  // left
  makeFace([v7, v4, v3, v2], [0, -1,  0], 4),  // down
  makeFace([v4, v7, v6, v5], [0,  0, -1], 5),  // back
];
