import { Forma } from "forma-embedded-view-sdk/auto"
import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"
import {
  addPolygon,
  useResize,
  useInjectCode,
  alignSceneChildrenToElevation,
  generateMeshFromTriangles,
  removeNonBuiltinLights
} from "./utils"
import BuildingIcon from '../../icons/BuildingIcon';
import TerrainIcon from '../../icons/TerrainIcon';
import CloseIcon from '../../icons/CloseIcon';
import LoadingAnimation from './LoadingAnimation';

const isRaycastHeperEnabled = true
const TERRAIN_ID = 'terrain'
const BUILDINGS_ID = 'buildings'
const TERRAIN_COLOR = "#CDCDCD"
const BUILDINGS_COLOR = "#F8F8F8"
const POLYGON_ID = 'polygon'
const POLYGON_COLOR = "#BDA6A7"

let renderIteration = 0

type GptThreeViewerInput = { code: string }

function GptThreeViewer(props: GptThreeViewerInput) {
  const { code } = props;
  const [isLoading, setIsLoading] = useState(true);

  const [scene] = useState(new THREE.Scene())
  const [_controls, setControls] = useState<OrbitControls>()
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>()
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()

  const [terrainMesh, setTerrainMesh] = useState<THREE.Mesh>()
  const [isTerrainVisible, setIsTerrainVisible] = useState(true);
  const [buildingsMesh, setBuildingsMesh] = useState<THREE.Mesh>()
  const [isBuildingsVisible, setIsBuildingsVisible] = useState(true);
  // const [polygonMesh, setPolygonMesh] = useState<THREE.Mesh>()

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --------------------------------------
  // External data setup
  // --------------------------------------

  async function initTerrain() {
    const terrainPath = await Forma.geometry.getPathsByCategory({
      category: "terrain",
    })
    const terrainTriangles = await Forma.geometry.getTriangles({
      path: terrainPath[0],
    })
    const mesh = generateMeshFromTriangles(terrainTriangles, TERRAIN_COLOR)

    mesh.rotation.x = -Math.PI / 2
    mesh.userData = {
      id: TERRAIN_ID,
      isBuiltin: true
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
    const mesh = generateMeshFromTriangles(buildingTriangles, BUILDINGS_COLOR)
    mesh.rotation.x = -Math.PI / 2
    mesh.userData = {
      id: BUILDINGS_ID,
      isBuiltin: true
    }

    if (terrainMesh != null) {
      scene.remove(terrainMesh)
    }

    scene.add(mesh)
    setBuildingsMesh(mesh)
  }

  // @todo: import stuff properly here
  async function initPolygon() {
    const hardcodedPolygon = [
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
    const mesh = await addPolygon({
      polygon: hardcodedPolygon,
      color: POLYGON_COLOR
    })
    mesh.rotation.x = -Math.PI / 2
    mesh.userData = {
      id: POLYGON_ID,
      isBuiltin: true
    }
    if (terrainMesh != null) {
      scene.remove(terrainMesh)
    }
    scene.add(mesh)
    setPolygonMesh(mesh)
  }

  // --------------------------------------
  // THREEJS setup
  // --------------------------------------

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Setup basic THREE js app for the canvas
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      logarithmicDepthBuffer: true
    })

    setRenderer(renderer)
    scene.background = new THREE.Color(0xffffff);


    const newCamera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      10000,
    )
    // newCamera.up.set(0, 0, 1) // @note: SETS THE UP DIRECTION TO Z
    newCamera.position.set(200, 100, 400)
    setCamera(newCamera)
    setControls(new OrbitControls(newCamera, canvas))

    const dl = new THREE.DirectionalLight(0xffffff, 1)
    dl.position.set(0, 0.75, 0.2)
    dl.userData = {
      isBuiltin: true
    }

    scene.add(dl)

    const l = new THREE.AmbientLight(0xffffff, 3)
    l.userData = {
      isBuiltin: true
    }
    scene.add(l)

    initTerrain()
    initBuidings()
    initPolygon()
    // setTimeout(() => {
      setIsLoading(false)
    // }, 3000)
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

  // --------------------------------------
  // --------------------------------------

  const onAfterCodeInjection = useCallback(async () => {
    // align scene children to elevation
    const blacklistedIds = [TERRAIN_ID, BUILDINGS_ID, POLYGON_ID]
    await alignSceneChildrenToElevation({ scene, terrainMesh, isRaycastHeperEnabled, blacklistedIds })

    // remove added light that is not built in to the scene
    removeNonBuiltinLights({ scene })
  }, [scene, terrainMesh, buildingsMesh])

  // resizer
  useResize({ camera, renderer, canvasRef })

  // code execution
  const { error } = useInjectCode({ camera, renderer, scene, canvasRef, terrainMesh, code, cb: onAfterCodeInjection })

  // --------------------------------------
  // UI buttons etc
  // --------------------------------------

  // function togglePolygon() {
  //   if (polygonMesh) {
  //     polygonMesh.visible = !polygonMesh.visible
  //   }
  // }

  function toggleBuildings() {
    if (buildingsMesh) {
      buildingsMesh.visible = !buildingsMesh.visible
      setIsBuildingsVisible(buildingsMesh.visible)
    }
  }

  function toggleTerrain() {
    if (terrainMesh) {
      terrainMesh.visible = !terrainMesh.visible
      setIsTerrainVisible(terrainMesh.visible)
    }
  }

  async function addToForma() {

    if (terrainMesh) {
      scene.remove(terrainMesh)
    }
    if (buildingsMesh) {
      scene.remove(buildingsMesh)
    }

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

    if (terrainMesh) {
      scene.add(terrainMesh)
    }
    if (buildingsMesh) {
      scene.add(buildingsMesh)
    }
  }

  // --------------------------------------
  // --------------------------------------

  return (
    <div class="canvas-container">

      <div class="canvas-buttons">
        {/* <weave-button */}
        {/*   onClick={() => { */}
        {/*     togglePolygon() */}
        {/*   }} */}
        {/* > */}
        {/*   Toggle polygon */}
        {/* </weave-button> */}

        <weave-button
          disabled={isLoading}
          onClick={() => {
            toggleBuildings()
          }}
        >
          Toggle buildings
          &nbsp;
          {isBuildingsVisible
            ? <BuildingIcon width="18" height="18" />
            : <CloseIcon />
          }
        </weave-button>

        <weave-button
          disabled={isLoading}
          onClick={() => {
            toggleTerrain()
          }}
        >
          Toggle terrain
          &nbsp;
          {isTerrainVisible
            ? <TerrainIcon />
            : <CloseIcon />
          }
        </weave-button>

      </div>

      {error && <div class="canvas-error-message">{error}</div>}
      {isLoading && <div class="canvas-loading-container">
        Crafting ...
        <LoadingAnimation />
      </div>}

      <weave-button
        disabled={isLoading}
        variant="solid"
        class="canvas-submit-button"
        onClick={() => {
          addToForma()
        }}
      >
        Crafting complete! Add to Forma
      </weave-button>

      <canvas
        id="canvas"
        ref={canvasRef}
        style={{
          pointerEvents: isLoading ? 'none' : 'auto',
          width: '100%',
          height: '100%',
          display: 'block', // Removes default canvas margin/spacing
        }}
      />
    </div>
  )
};

export default GptThreeViewer;
