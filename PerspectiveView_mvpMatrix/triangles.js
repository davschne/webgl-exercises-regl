function makeVertex(position, color) {
  return { position, color };
}

function makePolygon(...vertices) {
  return vertices;
}

const BLUISH = [0.4, 0.4, 1];
const YELLOWISH = [1, 1, 0.4];
const GREENISH = [0.4, 1, 0.4];
const REDDISH = [1, 0.4, 0.4];

const backGreenTriangle = makePolygon(
  makeVertex([0, 1, -4], GREENISH),
  makeVertex([-0.5, -1, -4], GREENISH),
  makeVertex([0.5, -1, -4], REDDISH),
);

const middleYellowTriangle = makePolygon(
  makeVertex([0, 1, -2], YELLOWISH),
  makeVertex([-0.5, -1, -2], YELLOWISH),
  makeVertex([0.5, -1, -2], REDDISH),
);

const frontBlueTriangle = makePolygon(
  makeVertex([0, 1, 0], BLUISH),
  makeVertex([-0.5, -1, 0], BLUISH),
  makeVertex([0.5, -1, 0], REDDISH),
);

export default [
  frontBlueTriangle,
  middleYellowTriangle,
  backGreenTriangle,
];
