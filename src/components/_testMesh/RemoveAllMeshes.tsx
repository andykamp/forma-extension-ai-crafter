import { Forma } from "forma-embedded-view-sdk/auto";

export default function RemoveAll() {

  const remove = async () => {
    try {
      await Forma.render.cleanup();
      await Forma.render.glb.cleanup();

    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div class="row">
      <weave-button variant="outlined" onClick={remove}>
        Remove all mesh and glb
      </weave-button>
    </div>
  );
}
