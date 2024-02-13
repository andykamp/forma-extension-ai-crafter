import { Forma } from "forma-embedded-view-sdk/auto"
import { useEffect, useRef, useState } from 'preact/hooks';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"
import { DUMMY_STR_CODE } from "./constants"
import { addPolygon } from "./utils"

type GptThreeViewerInput = { code: string }

const isRaycastHeperEnabled = true
let renderIteration = 0
const TERRAIN_ID = 'terrain'
const BUILDINGS_ID = 'buildings'

function GptThreeViewer(props: GptThreeViewerInput) {
  const { code } = props;
  const [scene] = useState(new THREE.Scene())
  const [_controls, setControls] = useState<OrbitControls>()
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>()
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()

  const [terrainMesh, setTerrainMesh] = useState<THREE.Mesh>()
  const [buildingsMesh, setBuildingsMesh] = useState<THREE.Mesh>()
  const [polygonMesh, setPolygonMesh] = useState<THREE.Mesh>()

  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function initTerrain() {
    const terrainPath = await Forma.geometry.getPathsByCategory({
      category: "terrain",
    })
    const terrainTriangles = await Forma.geometry.getTriangles({
      path: terrainPath[0],
    })
    // const bbox = await Forma.terrain.getBbox()
    // console.log('bbox', bbox);
    // const terrainTriangles = await Forma.geometry.getTriangles()
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(terrainTriangles, 3),
    )
    geometry.computeVertexNormals()
    const material = new THREE.MeshPhongMaterial({
      color: "#CDCDCD",
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    mesh.userData = {
      id: TERRAIN_ID
    }

    if (terrainMesh != null) {
      scene.remove(terrainMesh)
    }
    scene.add(mesh)
    setTerrainMesh(mesh)
  }

  async function initBuidings() {
    const terrainPath = await Forma.geometry.getPathsByCategory({
      category: "terrain",
    })
    const buildingTriangles = await Forma.geometry.getTriangles({
      excludedPaths: terrainPath
    })
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(buildingTriangles, 3),
    )
    geometry.computeVertexNormals()
    const material = new THREE.MeshPhongMaterial({
      color: "#F8F8F8",
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    mesh.userData = {
      id: BUILDINGS_ID
    }

    if (terrainMesh != null) {
      scene.remove(terrainMesh)
    }
    scene.add(mesh)
    setBuildingsMesh(mesh)
  }
  async function initPolygon() {
    const p = await addPolygon()
    scene.add(p)
    setPolygonMesh(p)

  }

  async function alignElevatoin() {
    if (!terrainMesh) return

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
      points.push(new THREE.Vector3(x, y+offset, z));
      points.push(new THREE.Vector3(x, y+offset, z));

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
        console.log("No intersection found. Ensure the point is above the surface and within bounds.");
        return null
      }
    }

    scene.traverse(async (child) => {
      const userData = child.userData
      if (userData.id === TERRAIN_ID || userData.id === BUILDINGS_ID) return
      const { x, y, z } = child.position
      // const elevation = await Forma.terrain.getElevationAt({ x, y: z })
      const elevation = getThreejsElevation(x, z, terrainMesh) || 0
      if (isRaycastHeperEnabled) {
        addRaycastHelper(scene, x, y, z)
      }

      child.position.y += elevation
    })
  }

  // render loop

  useEffect(() => {
    if (!camera || !renderer) return
    renderIteration++
    const currentRenderIteration = renderIteration

    // Render the scene
    function loop() {
      if (camera != null && renderer != null) {

        renderer.render(scene, camera)
        if (currentRenderIteration === renderIteration) {
          requestAnimationFrame(loop)
        }
      }
    }
    requestAnimationFrame(loop)
  }, [camera, renderer])

  // resize


  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log('canvasss', canvas);

    // Setup basic THREE js app for the canvas
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      logarithmicDepthBuffer: true
    })

    setRenderer(renderer)
    // scene.background = new THREE.Color(0xffffff);


    const newCamera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      10000,
    )
    // newCamera.up.set(0, 0, 1) // @note: SETS THE UP DIRECTION TO Z
    newCamera.position.set(100, 200, 100)
    setCamera(newCamera)
    setControls(new OrbitControls(newCamera, canvas))

    const dl = new THREE.DirectionalLight(0xffffff, 1)
    dl.position.set(0, 0.75, 0.2)
    scene.add(dl)

    const l = new THREE.AmbientLight(0xffffff, 3)
    scene.add(l)

    initTerrain()
    initBuidings()
    initPolygon()
  }, [])

  // resizer


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


  useEffect(() => {
    if (!camera || !renderer || !scene || !canvasRef.current || !terrainMesh || !code) return
    const canvas = canvasRef.current;

    // Modify the script to use the created canvas
    const modifiedCode = DUMMY_STR_CODE //code.replace(/document\.body\.appendChild\(renderer\.domElement\);/, '');

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

      // align z axis
      alignElevatoin()

    } catch (error) {
      console.error('Error executing the script:', error);
    }

  }, [camera, renderer, scene, code, terrainMesh]);

  function togglePolygon() {
    if (polygonMesh) {
      polygonMesh.visible = !polygonMesh.visible
    }
  }

  function toggleBuildings() {
    if (buildingsMesh) {
      buildingsMesh.visible = !buildingsMesh.visible
    }
  }

  function toggleTerrain() {
    if (terrainMesh) {
      terrainMesh.visible = !terrainMesh.visible
    }
  }

  async function addToForma() {

    if (terrainMesh) {
      scene.remove(terrainMesh)
    }
    if (buildingsMesh) {
      scene.remove(buildingsMesh)
    }
    // rotateAllObjectsAroundSceneAxis(scene, -Math.PI / 2, 'x');

    const glb: ArrayBuffer = await new Promise((resolve, reject) => {
      new GLTFExporter().parse(
        scene,
        (res) => {
          resolve(res as ArrayBuffer)
        },
        reject,
        { binary: true },
      )
    })
    await Forma.render.glb.add({ glb })
    // rotateAllObjectsAroundSceneAxis(scene, -Math.PI / 2, 'x');
  }



  return (
    <>
      <button
        onClick={() => {
          togglePolygon()
        }}
      >
        Toggle polygon
      </button>
      <button
        onClick={() => {
          toggleBuildings()
        }}
      >
        Toggle buildings
      </button>

      <button
        onClick={() => {
          toggleTerrain()
        }}
      >
        Toggle terrain
      </button>

      <button
        onClick={() => {
          addToForma()
        }}
      >
        Add generated models to forma
      </button>

      <canvas
        id="canvas"
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block', // Removes default canvas margin/spacing
        }}
      />
    </>
  )
};

export default GptThreeViewer;
