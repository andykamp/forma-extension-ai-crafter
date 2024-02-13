import { Forma } from "forma-embedded-view-sdk/auto"
import { useEffect, useState, useRef } from "preact/hooks"
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  ShapeGeometry,
  Vector2,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"
import { addRaycastHelper, getThreejsElevation, repair } from "../lib/utils/terrain.utils"
import { createHouse, createTree } from "../lib/utils/mesh.utils"
import buildingApi, { EXAMPLE_BUILDING } from "../lib/api/building.api"
import { createTreeInPolygon } from "../lib/api/vegetation.api"
import {
  isPointInPolygon,
  getBoundingBox,
  getRandomPointInBoundingBox,
  getSquareAroundPoint,
} from '../lib/utils/geometry.utils';
// import sunApi from "../lib/api/sun.api"

let renderIteration = 0

const isRaycastHeperEnabled = false

function FloatingPanel() {
  const [scene] = useState(new Scene())
  const [_controls, setControls] = useState<OrbitControls>()
  const [camera, setCamera] = useState<PerspectiveCamera>()
  const [renderer, setRenderer] = useState<WebGLRenderer>()
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const [terrainMesh, setTerrainMesh] = useState<Mesh>()
  const [buildingsMesh, setBuildingsMesh] = useState<Mesh>()
  const [siteMesh, setSiteMesh] = useState<Mesh>();
  const [siteCoords, setSiteCoords] = useState<[number, number][]>();
  const [customMeshes, setCustomMeshes] = useState<Group[]>([])

  function addTree(scene: Scene, x: number, y: number, z: number) {
    const group = createTree()
    group.position.set(x, y, z + 10)
    group.rotation.x = Math.PI / 2; // Rotate 90 degrees around X axis
    group.scale.set(10, 10, 10)

    scene.add(group)
    setCustomMeshes(prev => ([...prev, group]))

  }
  function addHouse(scene: Scene, x: number, y: number, z: number) {
    const group = createHouse()
    group.position.set(x, y, z + 10)
    group.rotation.x = Math.PI / 2; // Rotate 90 degrees around X axis
    group.scale.set(10, 10, 10)

    scene.add(group)
    setCustomMeshes(prev => ([...prev, group]))
  }

  function addHouseWithBuldingApi(scene: Scene, x: number, y: number, z: number) {

    const building = { ...EXAMPLE_BUILDING }
    building.footprint = getSquareAroundPoint([x, y], 20)// getLShapeAroundPoint([x,y], 20, 10, 40)

    const group = buildingApi.renderBuilding(building)
    // group.position.set(x, y, z + 10)
    group.position.z = z
    // group.rotation.x = Math.PI / 2; // Rotate 90 degrees around X axis
    // group.scale.set(10, 10, 10)

    scene.add(group)
    setCustomMeshes(prev => ([...prev, group]))
  }


  async function addTreeInPolygon(scene: Scene, terrainMesh: Mesh, coords: [number, number][]) {
    const group = createTreeInPolygon(coords, 100)
    for (let mesh of group.children) {
      console.log('mesh', mesh.position);
      const elevation = getThreejsElevation(mesh.position.x, mesh.position.y, terrainMesh) || 0
      mesh.position.z = elevation
    }
    scene.add(group)
    setCustomMeshes(prev => ([...prev, group]))
  }

  async function addRandomTrees() {
    if (!siteCoords || !terrainMesh) return
    addTreeInPolygon(scene, terrainMesh, siteCoords)
  }

  async function addRandomBuildings() {
    if (!siteCoords || !terrainMesh) return
    const buildingCount = 10;
    const boundingBox = getBoundingBox(siteCoords);

    for (let i = 0; i < buildingCount; i++) {
      let point: [number, number];
      do {
        point = getRandomPointInBoundingBox(boundingBox);
      } while (!isPointInPolygon(point, siteCoords));

      const elevation = getThreejsElevation(point[0], point[1], terrainMesh) || 0
      if (isRaycastHeperEnabled) {
        addRaycastHelper(scene, point[0], point[1], elevation)
      }
      const b = { ...EXAMPLE_BUILDING }
      b.footprint = getSquareAroundPoint(point, 20)// getLShapeAroundPoint([x,y], 20, 10, 40)

      const group = buildingApi.renderBuilding(b)
      group.position.z = elevation
      // b.position.set(point[0], point[1], 0); // Assuming Y is up-axis; adjust if Z is up-axis
      // b.scale.set(10, 10, 10); // Adjust scale as needed
      // b.rotation.x = Math.PI / 2; // Rotate 90 degrees around X axis

      scene.add(group)
    }

  }

  async function getSiteGeometry(mesh: Mesh) {
    mesh.updateMatrixWorld()
    const siteLimitPaths = await Forma.geometry.getPathsByCategory({ category: "site_limit" })
    const siteLimitFootprint = await Forma.geometry.getFootprint({ path: siteLimitPaths[0] })
    if (!siteLimitFootprint) return

    const coords = siteLimitFootprint.coordinates
    const arr = new Float32Array(coords.length * 3)
    for (let i = 0; i < coords.length; i++) {

      // Get the elevation for the current point's x and y coordinates
      const elevation = getThreejsElevation(coords[i][0], coords[i][1], mesh) || 0
      if (isRaycastHeperEnabled) {
        addRaycastHelper(scene, coords[i][0], coords[i][1], elevation)
      }
      // addTree(scene, coords[i][0], coords[i][1], elevation)
      // addHouse(scene, coords[i][0], coords[i][1], elevation)
      addHouseWithBuldingApi(scene, coords[i][0], coords[i][1], elevation)


      // Update the point's z value with the obtained elevation
      arr[i * 3] = coords[i][0]
      arr[i * 3 + 1] = coords[i][1]
      arr[i * 3 + 2] = elevation
    };

    let polyShape = new Shape(coords.map((coord) => new Vector2(coord[0], coord[1])))
    const polyGeometry = new ShapeGeometry(polyShape);
    polyGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(arr, 3)//coordinates.map(coord => [coord.x, coord.y, coord.elevation]).flat(), 3)
    )
    let polygon = new Mesh(
      polyGeometry,
      new MeshBasicMaterial({ color: "#BDA6A7", side: DoubleSide })
    )
    scene.add(polygon)
    setSiteMesh(polygon)
    setSiteCoords(coords)
  }

  async function getTerrainGeometry() {
    const terrainPath = await Forma.geometry.getPathsByCategory({
      category: "terrain",
    })
    const terrainTriangles = await Forma.geometry.getTriangles({
      path: terrainPath[0],
    })
    // const bbox = await Forma.terrain.getBbox()
    // console.log('bbox', bbox);
    // const terrainTriangles = await Forma.geometry.getTriangles()
    const geometry = new BufferGeometry()
    geometry.setAttribute(
      "position",
      new BufferAttribute(terrainTriangles, 3),
    )
    return geometry
  }

  async function initTerrain() {
    // const geometry = (await getTerrainGeometry()).toNonIndexed()
    const geometry = await getTerrainGeometry()
    geometry.computeVertexNormals()
    const material = new MeshPhongMaterial({ color: "#CDCDCD", side: DoubleSide }); // Light-reflective material

    const mesh = new Mesh(geometry, material)


    if (terrainMesh != null) {
      scene.remove(terrainMesh)
    }
    scene.add(mesh)
    setTerrainMesh(mesh)
    getSiteGeometry(mesh)
  }


  async function getBuildingGeometry() {
    const terrainPath = await Forma.geometry.getPathsByCategory({
      category: "terrain",
    })
    // const terrainTriangles = await Forma.geometry.getTriangles({
    //   path: terrainPath[0],
    // })
    // const bbox = await Forma.terrain.getBbox()
    // console.log('bbox', bbox);
    const buildingTriangles = await Forma.geometry.getTriangles({
      excludedPaths: terrainPath
    })
    const geometry = new BufferGeometry()
    geometry.setAttribute(
      "position",
      new BufferAttribute(buildingTriangles, 3),
    )
    return geometry
  }

  async function initbuildingsMesh() {
    const geometry = await getBuildingGeometry()
    geometry.computeVertexNormals()
    const material = new MeshPhongMaterial({ color: '#F8F8F8', side: DoubleSide }); // Light-reflective material

    const mesh = new Mesh(geometry, material)
    var edgeGeometry = new EdgesGeometry(mesh.geometry); // or WireframeGeometry
    var edgeMaterial = new LineBasicMaterial({ color: 'black', linewidth: 4 });
    var edges = new LineSegments(edgeGeometry, edgeMaterial);
    mesh.add(edges)


    if (terrainMesh != null) {
      scene.remove(terrainMesh)
    }
    scene.add(mesh)
    setBuildingsMesh(mesh)
  }

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(' window.innerWidth', window.innerWidth, window.innerHeight);

    void initTerrain()
    void initbuildingsMesh()

    // Setup basic THREE js app for the canvas
    const renderer = new WebGLRenderer({ canvas, alpha: true, logarithmicDepthBuffer: true }) //antialias: true })
    setRenderer(renderer)
    scene.background = new Color(0xffffff);


    const newCamera = new PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      10000,
    )
    newCamera.up.set(0, 0, 1) // @note: SETS THE UP DIRECTION TO Z
    newCamera.position.set(-100, -200, 100)
    setCamera(newCamera)
    setControls(new OrbitControls(newCamera, canvas))

    const dl = new DirectionalLight(0xffffff, 1)
    dl.position.set(0, 0.75, 0.2)
    scene.add(dl)

    const l = new AmbientLight(0xffffff, 3)
    scene.add(l)
    // sunApi.init(scene, newCamera, renderer,)

  }, [])

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


  // async function terrainToGlb() {
  //   const bbox = await Forma.terrain
  //     .getBbox()
  //     .then((bbox) => [
  //       [bbox.min.x, bbox.min.y] as [number, number],
  //       [bbox.max.x, bbox.max.y] as [number, number],
  //     ])
  //   const glb: ArrayBuffer = await new Promise((resolve, reject) => {
  //     if (terrainMesh != null) {
  //       const exportmesh = new Mesh(terrainMesh.geometry.clone())
  //       repair(bbox, exportmesh.geometry)
  //       exportmesh.geometry.rotateX(-Math.PI / 2)
  //       new GLTFExporter().parse(
  //         exportmesh,
  //         (res) => {
  //           resolve(res as ArrayBuffer)
  //         },
  //         reject,
  //         { binary: true },
  //       )
  //     }
  //   })
  //   return glb
  // }

  // async function save() {
  //   const glb = await terrainToGlb()
  //   await Forma.proposal.replaceTerrain({ glb })
  //   or 
  // const glb = await terrainToGlb()
  // await Forma.render.glb.add({ glb })

  // }

  // function goto() {
  //   void initTerrain()
  // }

  // @todo: remove
  // Function to rotate all objects in the scene around a specific scene axis
  function rotateAllObjectsAroundSceneAxis(scene: Scene, angle: number, axis: string) {
    const rotationMatrix = new Matrix4(); // Create a new rotation matrix

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
        object.rotation.setFromRotationMatrix(rotationMatrix.multiply(object.matrix.extractRotation(new Matrix4())));
      }
    });
  }

  async function addToForma() {

    if (terrainMesh) {
      scene.remove(terrainMesh)
    }
    if (buildingsMesh) {
      scene.remove(buildingsMesh)
    }
    if (siteMesh) {
      scene.remove(siteMesh)
    }
    rotateAllObjectsAroundSceneAxis(scene, -Math.PI / 2, 'x');

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
    rotateAllObjectsAroundSceneAxis(scene, -Math.PI / 2, 'x');

  }
  function toggleSite() {
    if (siteMesh) {
      siteMesh.visible = !siteMesh.visible
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

  return (
    <>
      <button
        onClick={() => {
          toggleSite()
        }}
      >
        Toggle site
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
          addRandomTrees()
        }}
      >
        Add random trees
      </button>
      <button
        onClick={() => {
          addRandomBuildings()
        }}
      >
        Add random buildings
      </button>

      <button
        onClick={() => {
          void addToForma()
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
}
export default FloatingPanel

