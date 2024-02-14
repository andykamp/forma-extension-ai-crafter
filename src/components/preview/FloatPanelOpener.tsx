import { Forma } from "forma-embedded-view-sdk/auto";
import { useState, useEffect } from "preact/hooks";
import type { PromptHistory } from "./preview";
import type { Vec3 } from "forma-embedded-view-sdk/dist/internal/scene/design-tool";

function getFloatingPanelUrl() {
  const url = new URL(
    'http://localhost:8081/floating-panel' 
  )

  return url.toString()
}

export function FloatPanelOpener() {
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
    // if(selectedPrompMessageId === 0) return
    const url = getFloatingPanelUrl();
    void Forma.openFloatingPanel({
      embeddedViewId: "floating-panel",
      url,
      preferredSize: {
        width: 10000,
        height: 10000
      },
    })
  }

  return (
    <>
      <div class="section">
        <weave-button
          variant="solid" onClick={openFloatingPanel}
        >
        Open terrain viewer 
      </weave-button>
      </div>
    </>
  );
}
