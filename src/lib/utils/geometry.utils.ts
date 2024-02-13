
export function isPointInPolygon(point: [number, number], vs: [number, number][]) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

  const x = point[0],
    y = point[1]

  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0],
      yi = vs[i][1]
    const xj = vs[j][0],
      yj = vs[j][1]

    const intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }

  return inside
}

export function getRandomPointInBoundingBox(boundingBox: [[number, number], [number, number]]) {
  const [min, max] = boundingBox;
  return [
    Math.random() * (max[0] - min[0]) + min[0],
    Math.random() * (max[1] - min[1]) + min[1]
  ] as [number, number];
}

export function getBoundingBox(polygon: [number, number][]) {
  const xs = polygon.map(([x, _]) => x);
  const ys = polygon.map(([_, y]) => y);
  return [[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]] as [[number, number], [number, number]];
}


// dummy stuff 

export function getSquareAroundPoint(center: [number, number], sideLength: number): [number, number][] {
  const [cx, cy] = center; // Destructure center point into x and y
  const halfSide = sideLength / 2;

  // Calculate the vertices of the square and return them as an array of [x, y] pairs
  return [
    [cx - halfSide, cy + halfSide], // Top-left
    [cx + halfSide, cy + halfSide], // Top-right
    [cx + halfSide, cy - halfSide], // Bottom-right
    [cx - halfSide, cy - halfSide]  // Bottom-left
  ];
}

export function getLShapeAroundPoint(center: [number, number], longArm: number, shortArm: number, thickness: number): [number, number][] {
  const [cx, cy] = center;

  // Calculate the vertices of the "L" shape
  return [
    [cx - longArm / 2, cy + shortArm / 2], // Outer top-left
    [cx + longArm / 2, cy + shortArm / 2], // Outer top-right
    [cx + longArm / 2, cy + shortArm / 2 - thickness], // Inner top-right
    [cx - longArm / 2 + thickness, cy + shortArm / 2 - thickness], // Inner top-left, before the bend
    [cx - longArm / 2 + thickness, cy - longArm / 2 + thickness], // Inner bottom-left, after the bend
    [cx - longArm / 2, cy - longArm / 2 + thickness], // Outer bottom-left, after the bend
    [cx - longArm / 2, cy - longArm / 2]  // Outer bottom-left
  ];
}

