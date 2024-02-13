import { Forma } from "forma-embedded-view-sdk/auto";
import { Mesh, BufferAttribute, BufferGeometry, Raycaster, Vector3, Line, LineBasicMaterial, Scene } from "three"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"

export async function getElevationMatrix(x: number, y: number) {
  const elevation = await Forma.terrain.getElevationAt({ x, y });
  const transform: any = [
    1, 0, 0, 0,    // First row
    0, 1, 0, 0,    // Second row
    0, 0, 1, 0,    // Third row
    0, 0, elevation, 1  // Fourth row, with Z translation set
  ];
  return transform;
}

// TERRAIN REPAIR

function recalculateUVs(position: Float32Array, bboxLocal: [number, number][]) {
  const offset_x = -bboxLocal[0][0]
  const offset_y = -bboxLocal[0][1]
  const width = bboxLocal[1][0] - bboxLocal[0][0]
  const height = bboxLocal[1][1] - bboxLocal[0][1]

  const newUvs = new Array((2 * position.length) / 3)
  for (let i = 0; i < position.length / 3; i++) {
    newUvs[2 * i] = (position[3 * i] + offset_x) / width
    newUvs[2 * i + 1] = 1 - (position[3 * i + 1] + offset_y) / height
  }
  return new Float32Array(newUvs)
}

export function repair(bbox: [number, number][], geometry: BufferGeometry) {
  const uvs = recalculateUVs(
    geometry.attributes.position.array as Float32Array,
    bbox,
  )
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2))
}


// TERRAIN UTILS

export async function getTerrainGeometry() {
  const terrainPath = await Forma.geometry.getPathsByCategory({
    category: "terrain",
  })
  const terrainTriangles = await Forma.geometry.getTriangles({
    path: terrainPath[0],
  })
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    "position",
    new BufferAttribute(terrainTriangles, 3),
  )
  return geometry
}

export async function replaceTerrain(terrainMesh: Mesh) {
  const bbox = await Forma.terrain
    .getBbox()
    .then((bbox) => [
      [bbox.min.x, bbox.min.y] as [number, number],
      [bbox.max.x, bbox.max.y] as [number, number],
    ])
  const glb: ArrayBuffer = await new Promise((resolve, reject) => {
    if (terrainMesh != null) {
      const exportmesh = new Mesh(terrainMesh.geometry.clone())
      repair(bbox, exportmesh.geometry)
      exportmesh.geometry.rotateX(-Math.PI / 2)
      new GLTFExporter().parse(
        exportmesh,
        (res) => {
          resolve(res as ArrayBuffer)
        },
        reject,
        { binary: true },
      )
    }
  })
  await Forma.proposal.replaceTerrain({ glb })
}

export function addRaycastHelper(
  scene: Scene, 
  x:number,
  y:number,
  z: number,
){
const material = new LineBasicMaterial({
	color: 0x0000ff
});

  const offset = 1000
const points = [];
points.push( new Vector3( x, y, z+offset ) );
points.push( new Vector3( x, y, z-offset ) );

const geometry = new BufferGeometry().setFromPoints( points );

const line = new Line( geometry, material );
scene.add( line );
}

export function getThreejsElevation(x:number, y:number, surfaceMesh: Mesh) {

  const someHighValueAboveSurface = 1000
  const raycaster = new Raycaster();
  const downVector = new Vector3(0, 0, -1); // Direction: down
  const originPoint = new Vector3(
    x,
    y,
    someHighValueAboveSurface 
  ); // Start the ray above the surface
  console.log('originPoint', originPoint);

  raycaster.set(originPoint, downVector);
  console.log('raycaster',raycaster, surfaceMesh );

  const intersects = raycaster.intersectObject(surfaceMesh, true);

  if (intersects.length > 0) {
    const intersectionPoint = intersects[0].point;
    console.log("Y value at given X, Z:", intersectionPoint.z);
    return intersectionPoint.z
  } else {
    console.log("No intersection found. Ensure the point is above the surface and within bounds.");
    return null
  }
}
