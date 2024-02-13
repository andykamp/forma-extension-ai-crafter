import { Forma } from "forma-embedded-view-sdk/auto"
import { RefObject } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import * as THREE from 'three';

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

type Point = {
  x: number;
  y: number;
  z: number;
}

const defaultPoly: Point[] = [
  {
    x: 219.33777656630846,
    y: -50.91393813236924,
    z: 22.12495751785366
  },
  {
    x: 231.47731857895823,
    y: -100.54778426098883,
    z: 21.63478611987682
  },
  {
    x: 166.84892464529258,
    y: -93.08562445100738,
    z: 20.927945636131312
  }
]

export async function addPolygon(
  polygon = defaultPoly
) {

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
    new THREE.MeshBasicMaterial({ color: "#BDA6A7", side: THREE.DoubleSide })
  )
  return p
}

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

      console.log('Resized to: ', window.innerWidth, window.innerHeight);
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
    // @ts-ignore
    const modifiedCode = code.match(/<script>([\s\S]*?)<\/script>/)[1]

    console.log('___COOOOOOODEEEE___', modifiedCode);

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
      console.error('Error executing the script:', error);
    }
  }, [camera, renderer, scene, code, terrainMesh]);

  return { error } as const

}
