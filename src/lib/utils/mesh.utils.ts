import { 
  BoxGeometry,
  ConeGeometry, 
  CylinderGeometry,
  EdgesGeometry, 
  Group,
  LineBasicMaterial, 
  LineSegments, 
  Mesh, 
  MeshBasicMaterial 
} from "three";

export function createTree() {
  // Stem: smaller diameter, brown
  const stemGeometry = new CylinderGeometry(0.1, 0.1, 1, 32);
  const stemMaterial = new MeshBasicMaterial({ color: 0x8B4513 }); // Brown
  const stem = new Mesh(stemGeometry, stemMaterial);

  // Leaves: larger diameter, green, positioned on top of the stem
  const leavesGeometry = new CylinderGeometry(0.5, 0.5, 1.5, 32);
  const leavesMaterial = new MeshBasicMaterial({ color: 0x008000 }); // Green
  const leaves = new Mesh(leavesGeometry, leavesMaterial);
  leaves.position.y = 1; // Adjust position based on stem height
  var edgeGeometry = new EdgesGeometry(leaves.geometry); // or WireframeGeometry
  var edgeMaterial = new LineBasicMaterial({ color: 'black', linewidth: 4 });
  var edges = new LineSegments(edgeGeometry, edgeMaterial);
  leaves.add(edges);


  //create a group and add the two cubes
  //These cubes can now be rotated / scaled etc as a group
  const group = new Group();
  group.add(stem);
  group.add(leaves);
  return group;

}

export function createHouse() {
  const group = new Group();

  // House body
  const bodyGeometry = new BoxGeometry(1, 1, 1);
  const bodyMaterial = new MeshBasicMaterial({ color: 0x8B4513 }); // Example color
  const body = new Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  // Gable roof
  const roofGeometry = new ConeGeometry(0.65, 0.5, 4); // Cone with 4 faces for gable roof
  const roofMaterial = new MeshBasicMaterial({ color: 0x8B0000 }); // Example color
  const roof = new Mesh(roofGeometry, roofMaterial);
  roof.position.y = 0.75; // Adjust based on body size
  roof.rotation.y = Math.PI / 4; // Align the roof's edge with the house
  group.add(roof);

  return group;
}
