import { Forma } from "forma-embedded-view-sdk/auto";
import { useState, useEffect } from "preact/hooks";

export default function Buildings() {
  const [buildingPaths, setBuildingPaths] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      Forma.geometry
        .getPathsByCategory({ category: "building" })
        .then(setBuildingPaths);
    };
    fetchData();
  }, []);

  return (
    <>
      <div class="section">
        <p>Total number of buildings: {buildingPaths?.length}</p>
      </div>
    </>
  );
}
