import { Forma } from "forma-embedded-view-sdk/auto";
// import { getElevationMatrix } from "../lib/utils/terrain.utils";

const glbUrl = "https://dls2assetsharedeastno001.blob.core.windows.net/game/lambo.glb";
// const glbUrl = "https://dls2assetsharedeastno001.blob.core.windows.net/game/rubble_building_simplified.glb";

// const centerLat = 59.92766746461007;
// const centerLon = 10.72865348834597;

export default function AddGlb() {

  const fetchAndAddGlb = async () => {
    try {
      // Fetch the GLB file as ArrayBuffer
      const response = await fetch(glbUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch GLB file: ${response.statusText}`);
      }
      const glbArrayBuffer = await response.arrayBuffer();

      return glbArrayBuffer;

    } catch (err) {
      // Handle any errors
      console.error('err', err);
    }
  };

  const addGlb = async () => {
    try {
      const glbArrayBuffer = await fetchAndAddGlb();
      if (!glbArrayBuffer) return;
      // const transform: any = getElevationMatrix(centerLat, centerLon);
      const { id } = await Forma.render.glb.add({
        glb: glbArrayBuffer,
      })
      // console.log('glb res', id);
      // const res = await Forma.render.glb.update({
      //   id,
      //   glb: glbArrayBuffer,
      // });
      // console.log('glb update res', res);

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div class="row">
      <weave-button variant="outlined" onClick={addGlb}>
        Add glb
      </weave-button>
    </div>
  );
}
