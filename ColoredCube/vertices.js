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

export const vertices = [
  v0, v1, v2, v3,  // front
  v0, v3, v4, v5,  // right
  v0, v5, v6, v1,  // up
  v1, v6, v7, v2,  // left
  v7, v4, v3, v2,  // down
  v4, v7, v6, v5,  // back
];

const BLUISH = [0.4, 0.4, 1];
const GREENISH = [0.4, 1, 0.4];
const REDDISH = [1, 0.4, 0.4];
const YELLOWISH = [1, 1, 0.4];
const WHITE = [1, 1, 1];
const BLUE_GREEN = [0.4, 1, 1];

export const colors = [
  BLUISH,      BLUISH,      BLUISH,      BLUISH,     // front(blue)
  GREENISH,    GREENISH,    GREENISH,    GREENISH,   // right(green)
  REDDISH,     REDDISH,     REDDISH,     REDDISH,    // up(red)
  YELLOWISH,   YELLOWISH,   YELLOWISH,   YELLOWISH,  // left
  WHITE,       WHITE,       WHITE,       WHITE,      // down
  BLUE_GREEN,  BLUE_GREEN,  BLUE_GREEN,  BLUE_GREEN, // back
];

export const indices = [
  [0, 1, 2],   [0, 2, 3],  // front
  [4, 5, 6],   [4, 6, 7],  // right
  [8, 9,10],   [8,10,11],  // up
  [12,13,14],  [12,14,15], // left
  [16,17,18],  [16,18,19], // down
  [20,21,22],  [20,22,23], // back
];
