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

function makeFace(vertices, color, faceIndex) {
  const offset = faceIndex * 4;
  const face = faceIndex + 1;
  return {
    positions: vertices,
    colors: [color, color, color, color],
    face: [face, face, face, face],
    indices: [[offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]],
  };
}

export const faces = [
  makeFace([v0, v1, v2, v3], [0.32, 0.18, 0.56], 0),  // front
  makeFace([v0, v3, v4, v5], [0.5,  0.41, 0.69], 1),  // right
  makeFace([v0, v5, v6, v1], [0.78, 0.69, 0.84], 2),  // up
  makeFace([v1, v6, v7, v2], [0,    0.32, 0.61], 3),  // left
  makeFace([v7, v4, v3, v2], [0.27, 0.58, 0.82], 4),  // down
  makeFace([v4, v7, v6, v5], [0.73, 0.82, 0.93], 5),  // back
];
