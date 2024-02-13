import { FloatPanelOpener } from "./preview/FloatPanelOpener";
import DaylightSection from "./daylight/DaylightSection";
import TestMeshSection from "./_testMesh/TestMeshSection";
import TestInfoSection from "./_testInfo/TestInfoSection";
import SelectArea from "./SelectArea";

export default function Sidebar() {
  return (
    <>
      <SelectArea />
      {/* <DaylightSection/>
      <TestMeshSection/>
      <TestInfoSection/>
      <FloatPanelOpener/> */}
    </>
  );
}
