import { Forma } from "forma-embedded-view-sdk/auto";
import { useState, useEffect } from "preact/hooks";

export default function Project() {
  const [projectInfo, setProjectInfo] = useState<any>();
  const [geoLocation, setGeoLocation] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const p = await Forma.project.get()
      setProjectInfo(p);

      const res = await Forma.project.getGeoLocation()
      setGeoLocation(res);
    };
    fetchData();
  }, []);

  return (
    <>
      <div class="section">
        <p>Project info</p>
        <pre>{JSON.stringify(projectInfo, null, 2)}</pre>
        <p>geoLocation:  </p>
        <pre>{JSON.stringify(geoLocation, null, 2)}</pre>
      </div>
    </>
  );
}
