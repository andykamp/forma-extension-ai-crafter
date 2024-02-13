import * as THREE from 'three';


type Footprint = [number, number][]; // should be 2d polygon

type FloorType = 'residential' | 'commercial';

type RoofType = 'flat' | 'skewed' | 'gable';

type Floor = {
  height: number;
  type: FloorType;
  color: string; // Color can be derived from type, but stored for convenience
};

type Roof = {
  type: RoofType;
  // Additional properties based on roof type can be added here
};

type Building = {
  footprint: Footprint;
  floors: Floor[];
  roof: Roof | null;
};

type Constraints = {
  footprint: Footprint;
};

const colorMap: Record<FloorType, string> = {
  residential: '#D8DCFF',
  commercial: '#FEEAA5'
}
const floorTypes: Record<FloorType, FloorType> = {
  residential: 'residential',
  commercial: 'commercial'
}

export const EXAMPLE_BUILDING: Building = {
  footprint: [[0, 1]],
  floors: [
    { height: 3, type: floorTypes.residential, color: colorMap.residential },
    { height: 3, type: floorTypes.residential, color: colorMap.residential },
    { height: 10, type: floorTypes.commercial, color: colorMap.commercial }
  ],
  roof: {
    type: 'flat',
  }
}

const buildingApi = {
  buildings: [] as Building[],
  constraints: [] as Constraints[],

  addConstraint: function(footprint: Footprint): Constraints {
    const constraint: Constraints = {
      footprint,
    };
    this.constraints.push(constraint);
    return constraint;
  },

  addBuilding: function(footprint: Footprint): Building {
    const building: Building = {
      footprint,
      floors: [],
      roof: null,
    };
    this.buildings.push(building);
    return building;
  },

  updateFootprint: function(buildingId: number, newFootprint: Footprint): void {
    const building = this.buildings[buildingId];
    building.footprint = newFootprint;
    // Update building geometry here
  },

  addFloor: function(buildingId: number, height: number, type: FloorType): void {
    const color = type === 'residential' ? 'blue' : 'green'; // Example colors
    const floor: Floor = {
      height,
      type,
      color,
    };
    this.buildings[buildingId].floors.push(floor);
    // Add floor geometry here based on footprint and height
  },

  updateFloor: function(buildingId: number, floorIndex: number, newFloor: Floor): void {
    this.buildings[buildingId].floors[floorIndex] = newFloor
  },

  addOrUpdateRoof: function(buildingId: number, roofType: RoofType): void {
    const roof: Roof = {
      type: roofType,
      // Additional roof properties can be added here
    };
    this.buildings[buildingId].roof = roof;
    // Add roof geometry here based on the type
  },

  // RENDER STUFF
  //
  buildingMeshes: [] as THREE.Group[],

  createFloor: function(floor: Floor, footprint: Footprint): THREE.Mesh {
    console.log('floor', floor);
    let footprintShape = new THREE.Shape(footprint.map((coord: any) => new THREE.Vector2(coord[0], coord[1])))
    const geometry = new THREE.ExtrudeGeometry(footprintShape, { depth: floor.height, bevelEnabled: false });
    const material = new THREE.MeshPhongMaterial({ color: floor.color });
    const mesh = new THREE.Mesh(geometry, material);
    var edgeGeometry = new THREE.EdgesGeometry(mesh.geometry); // or WireframeGeometry
    var edgeMaterial = new THREE.LineBasicMaterial({ color: 'black', linewidth: 4 });
    var edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    mesh.add(edges);
    return mesh;

  },

  createFlatRoof: function(footprint: Footprint): THREE.Mesh {
    let footprintShape = new THREE.Shape(footprint.map((coord: any) => new THREE.Vector2(coord[0], coord[1])))
    const roofGeometry = new THREE.ExtrudeGeometry(footprintShape, { depth: 0.2, bevelEnabled: false }); // Small depth for flat roof
    const roofMaterial = new THREE.MeshPhongMaterial({ color: '#fff' }); // Example roof color
    const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
    return roofMesh;
  },

  createRoof: function(roofType: RoofType, footprint: Footprint): THREE.Mesh {
    switch (roofType) {
      case 'flat':
        return this.createFlatRoof(footprint);
      // case 'skewed':
      //   return this.createSkewedRoof(footprint);
      // case 'gable':
      //   return this.createGableRoof(footprint);
      default:
        throw new Error('Invalid roof type');
    }
  },

  renderBuilding: function(building: Building): THREE.Group {
    // @todo: check if building already has a mesh and update it instead of creating a new one iw

    const group = new THREE.Group();

    let currentHeight = 0;
    building.floors.forEach((floor: Floor) => {
      const floorMesh = this.createFloor(floor, building.footprint);

      // Position the floor mesh at the current height
      floorMesh.position.set(0, 0, currentHeight);
      group.add(floorMesh);

      // Update the height for the next floor
      currentHeight += floor.height;
    });

    if (building.roof) {
      const roofMesh = this.createRoof(building.roof.type, building.footprint);

      // Position the roof mesh at the top of the highest floor
      roofMesh.position.set(0, 0, currentHeight);
      group.add(roofMesh);
      this.buildingMeshes.push(group);
    }

    return group;
  }
};

export default buildingApi;
