import { Forma } from "forma-embedded-view-sdk/auto"
import { RefObject } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import * as THREE from 'three';
import { DUMMY_STR_CODE } from './constants'


// --------------------------------------
// Misc
// --------------------------------------

// find the group
export function findGroupById(scene, id) {
  let found = null;
  scene.traverse((object) => {
    if (object.userData && object.userData.id === id) {
      found = object;
    }
  });
  return found;
}

// @todo:remove
export function rotateAllObjectsAroundSceneAxis(scene: THREE.Scene, angle: number, axis: string) {
  const rotationMatrix = new THREE.Matrix4(); // Create a new rotation matrix

  // Create a rotation matrix based on the specified axis and angle
  switch (axis) {
    case 'x':
      rotationMatrix.makeRotationX(angle);
      break;
    case 'y':
      rotationMatrix.makeRotationY(angle);
      break;
    case 'z':
      rotationMatrix.makeRotationZ(angle);
      break;
    default:
      console.warn('Invalid axis');
      return;
  }

  // scene.traverse((object:any) => {
  scene.children.forEach((object: any) => {

    if (object.isObject3D && object.isGroup) {
      // Apply the rotation matrix to the object's position
      object.position.applyMatrix4(rotationMatrix);

      // Rotate the object to align with the new position
      object.rotation.setFromRotationMatrix(rotationMatrix.multiply(object.matrix.extractRotation(new THREE.Matrix4())));
    }
  });
}

export function generateMeshFromTriangles(triangles: Float32Array, color: string) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(triangles, 3),
  )
  geometry.computeVertexNormals()
  const material = new THREE.MeshPhongMaterial({
    color: color,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}


type Point = {
  x: number;
  y: number;
  z: number;
}

type AddPolygonProps = {
  polygon: Point[];
  color?: string;
}

export async function addPolygon(props: AddPolygonProps) {
  const { polygon, color = '#BDA6A7' } = props

  const arr = new Float32Array(polygon.length * 3)
  for (let i = 0; i < polygon.length; i++) {
    // Update the point's z value with the obtained elevation
    arr[i * 3] = polygon[i].x
    arr[i * 3 + 1] = polygon[i].y
    arr[i * 3 + 2] = polygon[i].z
  };

  let polyShape = new THREE.Shape(polygon.map((coord) => new THREE.Vector2(coord.x, coord.y)))
  const polyGeometry = new THREE.ShapeGeometry(polyShape);
  polyGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(arr, 3)//coordinates.map(coord => [coord.x, coord.y, coord.elevation]).flat(), 3)
  )
  let p = new THREE.Mesh(
    polyGeometry,
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
  )
  return p
}

// --------------------------------------
// Resize stuff 
// --------------------------------------

type useResizeProps = {
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  canvasRef: RefObject<HTMLCanvasElement>;
}

export function useResize(props: useResizeProps) {
  const { camera, renderer, canvasRef } = props

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Function to resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Update camera aspect ratio and projection matrix
      if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }

      // Update renderer size
      if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    // Initial resize
    resizeCanvas();

    // Add event listener for window resize
    window.addEventListener('resize', resizeCanvas);

    // Your existing useEffect code here for setting up THREE.js...
    // Ensure you have `camera` and `renderer` defined in your component's state
    // so they can be accessed and updated here.

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [camera, renderer]);

}

// --------------------------------------
// Code inject stuff
// --------------------------------------

type UseInjectCodeProps = {
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  scene: THREE.Scene | undefined;
  canvasRef: RefObject<HTMLCanvasElement>;
  terrainMesh: THREE.Mesh | undefined;
  code: string | undefined;
  cb?: Function
}

export function useInjectCode(props: UseInjectCodeProps) {
  const { camera, renderer, scene, canvasRef, terrainMesh, code, cb } = props
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!camera || !renderer || !scene || !canvasRef.current || !terrainMesh || !code) return
    const canvas = canvasRef.current;
    // Modify the script to use the created canvas
    // const modifiedCode = code.replace(/<script>|<\/script>/g, ''); //DUMMY_STR_CODE //code.replace(/document\.body\.appendChild\(renderer\.domElement\);/, '');
    const codeInsideScripts = code.match(/<script>([\s\S]*?)<\/script>/)
    if (!codeInsideScripts || !codeInsideScripts.length) {
      setError('No code was generated. Seems like the Ai had a bad run :(')
      return
    }
    const modifiedCode = codeInsideScripts[1] //DUMMY_STR_CODE

    try {
      // Execute the script within the context of the containerRef
      const scriptFunc = new Function(
        'Forma',
        'THREE',
        'scene',
        'container',
        'canvas',
        'camera',
        'renderer',
        modifiedCode
      );
      scriptFunc(
        Forma,
        THREE,
        scene,
        renderer,
        canvas,
        camera,
        renderer,
      );

      cb?.()

    } catch (error) {
      setError('Error executing the script');
      console.error('Error executing the generated script. Seems like the Ai had a bad run :(', error);
    }
  }, [camera, renderer, scene, code, terrainMesh]);

  return { error } as const
}

type RemoveNonBuiltinLightsProps = {
  scene: THREE.Scene | undefined
}
export function removeNonBuiltinLights(props: RemoveNonBuiltinLightsProps) {
  const { scene } = props
  if (!scene) return
  const objectsToRemove: THREE.Object3D[] = [];

  // First, collect all lights that are not built-in
  scene.traverse((object) => {
    if (object instanceof THREE.Light && (!object.userData.isBuiltin)) {
      objectsToRemove.push(object);
    }
  });

  // Then, remove collected objects from the scene
  objectsToRemove.forEach((object) => {
    scene.remove(object);
  });
}


// --------------------------------------
// Elevation helpers 
// --------------------------------------

function addRaycastHelper(
  scene: THREE.Scene,
  x: number,
  y: number,
  z: number,
) {
  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });

  const offset = 1000
  const points = [];
  points.push(new THREE.Vector3(x, y + offset, z));
  points.push(new THREE.Vector3(x, y + offset, z));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(geometry, material);

  scene.add(line);
}


function getThreejsElevation(x: number, z: number, surfaceMesh: THREE.Mesh) {

  const someHighValueAboveSurface = 1000
  const raycaster = new THREE.Raycaster();
  const downVector = new THREE.Vector3(0, -1, 0); // Direction: down
  const originPoint = new THREE.Vector3(
    x,
    someHighValueAboveSurface,
    z,
  ); // Start the ray above the surface

  raycaster.set(originPoint, downVector);

  const intersects = raycaster.intersectObject(surfaceMesh, true);

  if (intersects.length > 0) {
    const intersectionPoint = intersects[0].point;
    return intersectionPoint.y
  } else {
    return null
  }
}

type AlignSceneChildrenToElevationProps = {
  scene: THREE.Scene,
  terrainMesh: THREE.Mesh | undefined
  blacklistedIds?: string[],
  isRaycastHeperEnabled: boolean,
}

export async function alignSceneChildrenToElevation(props: AlignSceneChildrenToElevationProps) {
  const {
    scene,
    terrainMesh,
    isRaycastHeperEnabled,
    blacklistedIds = []
  } = props

  if (!terrainMesh) return
  scene.traverse(async (child) => {
    const userData = child.userData
    if (userData.id === "gptGroup") {
      const { x, y, z } = child.position
      // const elevation = await Forma.terrain.getElevationAt({ x, y: z })
      const elevation = getThreejsElevation(x, z, terrainMesh) || 0
      if (isRaycastHeperEnabled) {
        addRaycastHelper(scene, x, y, z)
      }
      child.position.y = elevation
    }

  })
}

