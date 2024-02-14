import { FloatPanelOpener } from "./preview/FloatPanelOpener";
import { useEffect, useState } from "preact/hooks";
import Prompt from "./prompt/Prompt";
import "./styles.css";
import SelectOpenAiVersion from "./SelectOpenAiVersion";
import PromptHistoryList from "./prompt/PromptHistory/PromptHistoryList";
import { Forma } from "forma-embedded-view-sdk/auto";

async function openFloatingPanel() {
  try {
    const url = new URL(
      'http://localhost:8081/floating-panel'
    ).toString()
    await Forma.openFloatingPanel({
      embeddedViewId: "floating-panel",
      url,
      preferredSize: {
        width: 10000,
        height: 10000
      },
    })
  } catch (e) {
    console.warn(e)
  }
}


export default function Sidebar() {
  // const [polygonId, setPolygonId] = useState<string | null>(null)
  // const [polygon, setPolygon] = useState<Vec3[]>([])
  // const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([])
  const [openAiVersion, setOpenAiVersion] = useState<number>(2)
  useEffect(() => {
    window.addEventListener('historyPushState', async (e) => {
      const messageId = (e as CustomEvent).detail.messageId
      if (!messageId) return
      await openFloatingPanel()
      const port = await Forma.createMessagePort({
        embeddedViewId: "floating-panel",
        portName: "selectedPromptMessageId"
      })
      port.postMessage(messageId);
    })
    return () => {
      window.removeEventListener('historyPushState', () => null)
    }
  }, [])

  return (
    <>
      <div className={"sidebar-wrapper"}>
        {/* <SelectArea
          polygonId={polygonId}
          onDrawnPolygon={setPolygonId}
          onPolygon={setPolygon}
        /> */}
        <div>
          <h1>Your prompt history</h1>
          <PromptHistoryList />
          <h1>Select a model</h1>
          <SelectOpenAiVersion
            value={openAiVersion}
            onChange={(version) => {
              setOpenAiVersion(version)
            }}
          />
          <h1>Write new prompt</h1>
          <Prompt
            versionId={openAiVersion}
          />
        </div>
      </div>
    </>
  );
}
