import { FloatPanelOpener } from "./preview/FloatPanelOpener";
import DaylightSection from "./daylight/DaylightSection";
import TestMeshSection from "./_testMesh/TestMeshSection";
import TestInfoSection from "./_testInfo/TestInfoSection";

export default function Sidebar() {
  return (
    <>
      <DaylightSection/>
      <TestMeshSection/>
      <TestInfoSection/>
      <FloatPanelOpener/>
    </>
  );
}
