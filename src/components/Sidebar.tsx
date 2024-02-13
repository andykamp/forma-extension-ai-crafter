import { FloatPanelOpener } from "./preview/FloatPanelOpener";
import DaylightSection from "./daylight/DaylightSection";
import TestMeshSection from "./_testMesh/TestMeshSection";
import TestInfoSection from "./_testInfo/TestInfoSection";
import { useState } from "preact/hooks";
import SelectArea from "./SelectArea";

export default function Sidebar() {
  const [polygonId, setPolygonId] = useState<string | null>(null) 
  return (
    <>
      <SelectArea
        polygonId={polygonId}
        onDrawnPolygon={setPolygonId}
      />
      {/* <DaylightSection/>
      <TestMeshSection/>
      <TestInfoSection/>
      <FloatPanelOpener/> */}
      <FloatPanelOpener/> 
    </>
  );
}
