import { Group } from 'three';
import { createTree } from '../utils/mesh.utils'; // Adjust the import path as needed
import {
  isPointInPolygon,
  getBoundingBox,
  getRandomPointInBoundingBox
} from '../utils/geometry.utils';

export function createTreeInPolygon(polygon: [number, number][], treeCount: number) {
  const group = new Group();
  const boundingBox = getBoundingBox(polygon);

  for (let i = 0; i < treeCount; i++) {
    let point: [number, number];
    do {
      point = getRandomPointInBoundingBox(boundingBox);
    } while (!isPointInPolygon(point, polygon));

    const tree = createTree();
    tree.position.set(point[0], point[1], 0); // Assuming Y is up-axis; adjust if Z is up-axis
    tree.scale.set(10, 10, 10); // Adjust scale as needed
    tree.rotation.x = Math.PI / 2; // Rotate 90 degrees around X axis
    group.add(tree);

  }

  // group.rotation.x = Math.PI / 2; // Rotate 90 degrees around X axis
  return group;
}

const vegetationApi = {
  createTreeInPolygon
}
export default vegetationApi;

