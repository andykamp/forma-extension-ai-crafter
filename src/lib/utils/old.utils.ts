export function getDummyCubeGeometryData() {

  // Box dimensions in local units (e.g., meters)
  const width = 100; // X dimension
  const height = 100; // Y dimension
  const depth = 100; // Z dimension

  // Half dimensions for centering the box
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;

  // Define the 8 vertices of the box relative to the center point
  const vertices = [
    [-halfWidth, -halfHeight, halfDepth], // Front bottom left 0
    [halfWidth, -halfHeight, halfDepth], // Front bottom right 1
    [halfWidth, halfHeight, halfDepth], // Front top right 2
    [-halfWidth, halfHeight, halfDepth], // Front top left 3
    [-halfWidth, -halfHeight, -halfDepth], // Back bottom left 4
    [halfWidth, -halfHeight, -halfDepth], // Back bottom right 5
    [halfWidth, halfHeight, -halfDepth], // Back top right 6
    [-halfWidth, halfHeight, -halfDepth], // Back top left 7
  ];

  // Geometry data for the box
  const geometryData = {
    // Positions for all vertices (x, y, z)
    position: new Float32Array(vertices.flat()),

    // Colors for each vertex (R, G, B, A)
    color: new Uint8Array([
      ...Array(8).fill([255, 0, 0, 255]).flat(), // Red color for all vertices
    ]),

    // Indices defining two triangles for each face of the box
    index: [
      0, 1, 2, 0, 2, 3, // Front face
      1, 5, 6, 1, 6, 2, // Right face
      5, 4, 7, 5, 7, 6, // Back face
      4, 0, 3, 4, 3, 7, // Left face
      3, 2, 6, 3, 6, 7, // Top face
      4, 5, 1, 4, 1, 0, // Bottom face
    ],

    // Normals for each vertex (assuming outward normals for each face)
    normal: new Float32Array([
      ...Array(4).fill([0, 0, 1]), // Front face normals
      ...Array(4).fill([1, 0, 0]), // Right face normals
      ...Array(4).fill([0, 0, -1]), // Back face normals
      ...Array(4).fill([-1, 0, 0]), // Left face normals
      ...Array(4).fill([0, 1, 0]), // Top face normals
      ...Array(4).fill([0, -1, 0]), // Bottom face normals
    ].flat()),
// g for each vertex (simplified mapping)
    // Assuming the same texture is mapped to each face
    uv: new Float32Array([
      // Front face
      0, 0, // Bottom left
      1, 0, // Bottom right
      1, 1, // Top right
      0, 1, // Top left

      // Right face
      0, 0, // Bottom left
      1, 0, // Bottom right
      1, 1, // Top right
      0, 1, // Top left

      // Back face
      0, 0, // Bottom left
      1, 0, // Bottom right
      1, 1, // Top right
      0, 1, // Top left

      // Left face
      0, 0, // Bottom left
      1, 0, // Bottom right
      1, 1, // Top right
      0, 1, // Top left

      // Top face
      0, 0, // Bottom left
      1, 0, // Bottom right
      1, 1, // Top right
      0, 1, // Top left

      // Bottom face
      0, 0, // Bottom left
      1, 0, // Bottom right
      1, 1, // Top right
      0, 1  // Top left
    ]),
  };
  return geometryData;
}
export function getDummyTriangleGeometryData() {
  // // Define a simple triangle geometry
  // const geometryData = {
  //   // Optional: Define colors for each vertex (R, G, B, A)
  //   color: new Uint8Array([
  //     255, 0, 0, 255,   // Vertex 1: Red
  //     0, 255, 0, 255,   // Vertex 2: Green
  //     0, 0, 255, 255    // Vertex 3: Blue
  //   ]),

  //   // Optional: Indexes are not needed for a simple triangle but included for demonstration
  //   index: [0, 1, 2], // Defining a single triangle

  //   // Optional: Define normals for each vertex (assuming facing outwards along z-axis)
  //   normal: new Float32Array([
  //     0, 0, 1,  // Vertex 1 normal
  //     0, 0, 1,  // Vertex 2 normal
  //     0, 0, 1   // Vertex 3 normal
  //   ]),

  //   // Define positions for each vertex (x, y, z)
  //   position: new Float32Array([
  //     -size, -size, 0, // Vertex 1: Bottom left
  //     size, -size, 0,  // Vertex 2: Bottom right
  //     0, size, 0      // Vertex 3: Top middle
  //   ]),

  //   // Optional: Define UV mapping for each vertex
  //   uv: new Float32Array([
  //     0, 0,   // Vertex 1 UV
  //     1, 0,   // Vertex 2 UV
  //     size, 1  // Vertex 3 UV
  //   ])
  // };

  // Size of the triangle in local units (e.g., meters)
  const size = 100;

  // Define triangle vertices relative to the center point
  // const triangleVertices = [
  //   { x: -size, y: -size }, // Bottom left vertex
  //   { x: size, y: -size },  // Bottom right vertex
  //   { x: 0, y: size }       // Top vertex
  // ];

  // Geometry data with all properties
  const geometryData = {
    // Position for each vertex (x, y, z)
    // position: new Float32Array([
    //     centerLon + triangleVertices[0].x, centerLat + triangleVertices[0].y, 0, // Vertex 1
    //     centerLon + triangleVertices[1].x, centerLat + triangleVertices[1].y, 0, // Vertex 2
    //     centerLon + triangleVertices[2].x, centerLat + triangleVertices[2].y, 0  // Vertex 3
    // ]),
    position: new Float32Array([
      -size, -size, 0, // Vertex 1: Bottom left
      size, -size, 0,  // Vertex 2: Bottom right
      0, size, 0      // Vertex 3: Top middle
    ]),

    // Color for each vertex (R, G, B, A)
    color: new Uint8Array([
      255, 0, 0, 255,   // Vertex 1: Red
      0, 255, 0, 255,   // Vertex 2: Green
      0, 0, 255, 255    // Vertex 3: Blue
    ]),

    // Index to define the triangle (reusing vertices)
    index: [0, 1, 2], // This defines one triangle

    // Normal for each vertex (assuming the triangle faces up along the z-axis)
    normal: new Float32Array([
      0, 0, 1,  // Vertex 1 normal
      0, 0, 1,  // Vertex 2 normal
      0, 0, 1   // Vertex 3 normal
    ]),

    // UV mapping for each vertex (mapping texture coordinates)
    uv: new Float32Array([
      0, 0,    // Vertex 1 UV (bottom left of the texture)
      1, 0,    // Vertex 2 UV (bottom right of the texture)
      size, 1   // Vertex 3 UV (top center of the texture)
    ])
  };
  return geometryData;
}

    // UV mappin
