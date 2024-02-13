import { Forma } from "forma-embedded-view-sdk/auto";
import { useState, useEffect } from "preact/hooks";
import type { PromptHistory } from "./preview";
import type { Vec3 } from "forma-embedded-view-sdk/dist/internal/scene/design-tool";

function getFloatingPanelUrl(polygon: Vec3[], promptHistory: PromptHistory[]) {
  const url = new URL(
    'http://localhost:8081/floating-panel' 
  )

  // also add the polygon to the url to be used
  if(polygon != null) {
    const query = new URLSearchParams(url.search)
    query.set("polygon", JSON.stringify(polygon))
    query.set("promptHistory", JSON.stringify(promptHistory))
    url.search = query.toString()
  }

  return url.toString()
}

export type FloatPanelOpenerProps = {
  polygon: Vec3[],
  promptHistory: PromptHistory[]
};
export function FloatPanelOpener(props: FloatPanelOpenerProps) {
  const {
    polygon,
    promptHistory
  } = props
  const [siteLimitFootprint, setSiteLimitFootprint] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch footprint of the first found proposal site limit.
      const siteLimitPaths = await Forma.geometry.getPathsByCategory({ category: "site_limit" })
      const siteLimitFootprint = await Forma.geometry.getFootprint({ path: siteLimitPaths[0] })
      setSiteLimitFootprint(siteLimitFootprint);
    };
    fetchData();
  }, []);

  function openFloatingPanel() {
    const url = getFloatingPanelUrl(polygon, promptHistory);
    void Forma.openFloatingPanel({
      embeddedViewId: "floating-panel",
      url,
      preferredSize: {
        width: 10000,
        height: 10000,
      },
    })
  }

  return (
    <>
      <div class="section">
        <weave-button variant="solid" onClick={openFloatingPanel}>
        Open terrain viewer 
      </weave-button>
      </div>
    </>
  );
}
