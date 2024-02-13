import { Forma } from "forma-embedded-view-sdk/auto";
import { useState, useEffect } from "preact/hooks";

export default function SiteLimit() {
  const [sitePath, setSitePath] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      Forma.geometry
        .getPathsByCategory({ category: "site_limit" })
        .then(setSitePath);
      // also possible
      // const siteLimitPaths = await Forma.geometry.getPathsByCategory({ category: "site_limit" })
      // const siteLimitFootprint = await Forma.geometry.getFootprint({ path: siteLimitPaths[0] })
      // console.log('siteLimitFootprint', siteLimitFootprint);
    };
    fetchData();
  }, []);

  return (
    <>
      <div class="section">
        <p>Number of site-path: {sitePath?.length}</p>
      </div>
    </>
  );
}
