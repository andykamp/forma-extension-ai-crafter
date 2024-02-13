import { Forma } from "forma-embedded-view-sdk/auto"
import { useCallback, useState } from "preact/hooks"

export type SelectAreaProps = {
  polygonId: string | null
  onDrawnPolygon: (polygonId: string) => void
}
export default function SelectArea(props: SelectAreaProps) {
  const {
    polygonId,
    onDrawnPolygon
  } = props
  const [isActive, setIsActive] = useState(false)
  const removeDrawnPolygon = useCallback(() => {
    if(!polygonId) return
    Forma.render.geojson.remove({ id: polygonId })
    onDrawnPolygon("")
  }, [polygonId])

  const selectPolygon = useCallback(() => {
    removeDrawnPolygon()
    setIsActive(true)
    void Forma.designTool.getPolygon().then((polygon) => {
      if (!polygon) return
      const coordinates = [polygon.map(point => [point.x, point.y])]
      Forma.render.geojson.add({
        geojson: {
          type: 'FeatureCollection',
          features: [{
            properties: {
              // style: {
              //   fillColor: '#ff0000', // Specify the desired color here
              //   strokeColor: '#000000', // Border color, if applicable
              //   strokeWidth: 2 // Border width, if applicable
              // }
            },
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates
            }
          }]
        }
      }).then(({ id }) => {
        onDrawnPolygon(id)
        setIsActive(false)
      })
    })
  }, [ removeDrawnPolygon ])

  return (
    <div>
      <span>
        Select an area:
      </span>
      <weave-button variant="solid" onClick={selectPolygon}>
        {isActive
          ? "Click on last point to finish"
          : "Click in map to select area"
        }
      </weave-button>
      {/* UNCOMMENT FOR DEBUGGING */}
      {/* <weave-button variant="solid" onClick={removeSelectedPolyogon}>
        Remove mesh
      </weave-button> */}
    </div>
  )
}
