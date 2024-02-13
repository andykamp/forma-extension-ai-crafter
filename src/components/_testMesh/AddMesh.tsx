import { Forma } from "forma-embedded-view-sdk/auto";
import { getElevationMatrix } from "../../lib/utils/terrain.utils";
// import { getDummyTriangleGeometryData } from "../lib/utils/mesh.utils";
import { getDummyCubeGeometryData } from "../../lib/utils/old.utils";

// Center point (latitude, longitude) used as a conceptual reference
const centerLat = 59.92766746461007;
const centerLon = 10.72865348834597;

// const geometryData = getDummyTriangleGeometryData();
const geometryData = getDummyCubeGeometryData()

export default function AddMesh() {

  const addMesh = async () => {
    try {
      const transform: any = await getElevationMatrix(centerLat, centerLon);
      await Forma.render.addMesh({
        geometryData,
        transform
      })

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div class="row">
      <weave-button variant="outlined" onClick={addMesh}>
        Add mesh
      </weave-button>
    </div>
  );
}
