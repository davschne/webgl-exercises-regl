/* Create a cube
    v6----- v5
   /|      /|
  v1------v0|
  | |     | |
  | |v7---|-|v4
  |/      |/
  v2------v3
*/

const v0 = [1, 1, 1];
const v1 = [-1, 1, 1];
const v2 = [-1,-1, 1];
const v3 = [1,-1, 1];
const v4 = [1,-1,-1];
const v5 = [1, 1,-1];
const v6 = [-1, 1,-1];
const v7 = [-1,-1,-1];

const RED = [1, 0, 0];

function makeFace(vertices, color, normal, faceIndex) {
  const offset = faceIndex * 4;
  return {
    positions: vertices,
    colors: [color, color, color, color],
    normals: [normal, normal, normal, normal],
    indices: [[offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]],
  };
}

export const faces = [
  makeFace([v0, v1, v2, v3], RED, [0, 0, 1], 0),  // front
  makeFace([v0, v3, v4, v5], RED, [1, 0, 0], 1),  // right
  makeFace([v0, v5, v6, v1], RED, [0, 1, 0], 2),  // up
  makeFace([v1, v6, v7, v2], RED, [-1, 0, 0], 3),  // left
  makeFace([v7, v4, v3, v2], RED, [0, -1, 0], 4),  // down
  makeFace([v4, v7, v6, v5], RED, [0, 0, -1], 5),  // back
];
