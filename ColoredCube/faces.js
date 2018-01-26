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

const BLUISH = [0.4, 0.4, 1];
const GREENISH = [0.4, 1, 0.4];
const REDDISH = [1, 0.4, 0.4];
const YELLOWISH = [1, 1, 0.4];
const WHITE = [1, 1, 1];
const BLUE_GREEN = [0.4, 1, 1];

function makeFace(vertices, color, faceIndex) {
  const offset = faceIndex * 4;
  return {
    positions: vertices,
    colors: [color, color, color, color],
    indices: [[offset, offset + 1, offset + 2], [offset, offset + 2, offset + 3]],
  };
}

export const faces = [
  makeFace([v0, v1, v2, v3], BLUISH, 0),  // front
  makeFace([v0, v3, v4, v5], GREENISH, 1),  // right
  makeFace([v0, v5, v6, v1], REDDISH, 2),  // up
  makeFace([v1, v6, v7, v2], YELLOWISH, 3),  // left
  makeFace([v7, v4, v3, v2], WHITE, 4),  // down
  makeFace([v4, v7, v6, v5], BLUE_GREEN, 5),  // back
];
