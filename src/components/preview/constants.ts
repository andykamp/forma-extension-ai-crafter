export const DUMMY_STR_CODE =
`

function createFloor(x, y, z, color) {
  const geometry = new THREE.BoxGeometry(10, 3, 10);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const floor = new THREE.Mesh(geometry, material);
  floor.position.set(x, y, z);
  scene.add(floor);

  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
  line.position.set(x, y, z);
  scene.add(line);
}

function createApartment(x, z, floors) {
  const floorHeight = 3;
  const colors = [0xFEEAA5, 0xD8DCFF];

  for (let i = 0; i < floors; i++) {
    const y = (i * floorHeight) + (floorHeight / 2) - 0.5;
    const color = colors[i % colors.length];
    createFloor(x, y, z, color);
  }
}

function createApartments() {
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 800 - 400;
    const z = Math.random() * 800 - 400;
    const floors = Math.floor(Math.random() * 8) + 3; // 3 to 10 floors
    createApartment(x, z, floors);
  }
}

function createShoppingMall() {
  const geometry = new THREE.BoxGeometry(100, 30, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0x8A2BE2 });
  const mall = new THREE.Mesh(geometry, material);
  mall.position.set(0, 15, 0);
  scene.add(mall);

  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
  line.position.set(0, 15, 0);
  scene.add(line);
}

createApartments();
createShoppingMall();

camera.position.set(200, 100, 400);
camera.lookAt(scene.position);

let angle = 0;
const radius = 800;

// function animate() {
//     requestAnimationFrame(animate);

//     angle += 0.001;

//     camera.position.x = radius * Math.sin(angle);
//     camera.position.z = radius * Math.cos(angle);
//     camera.lookAt(new THREE.Vector3(0, 50, 0));

//     renderer.render(scene, camera);
// }

// animate();


`

export const DUMMY_STR_CODE2 =
  `
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

  scene.add(mesh)
}

initBuidings()
`

export const DUMMY_GPT_RESPONSE =
  `

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function createFloor(x, y, z, color) {
  const geometry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const floor = new THREE.Mesh(geometry, material);
  floor.position.set(x, y, z);
  scene.add(floor);

  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
  line.position.set(x, y, z);
  scene.add(line);
}

function createApartment(x, z) {
  const floorCount = 4;
  const floorHeight = 10;
  const colors = [0xFEEAA5, 0xD8DCFF];

  for (let i = 0; i < floorCount; i++) {
    const y = (i * floorHeight) + (floorHeight / 2);
    const color = colors[i % colors.length];
    createFloor(x, y, z, color);
  }
}

function createApartments() {
  const radius = 50;
  const angleStep = Math.PI * 2 / 6;

  for (let i = 0; i < 6; i++) {
    const angle = i * angleStep;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    createApartment(x, z);
  }
}

createApartments();

camera.position.set(0, 50, 150);
camera.lookAt(scene.position);

let angle = 0;
const radius = 150;

function animate() {
  requestAnimationFrame(animate);

  angle += 0.001;

  camera.position.x = radius * Math.sin(angle);
  camera.position.z = radius * Math.cos(angle);
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();

`
