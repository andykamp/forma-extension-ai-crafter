import { FloatPanelOpener } from "./preview/FloatPanelOpener";
import { useState } from "preact/hooks";
import Prompt from "./prompt/Prompt";
import "./styles.css";
import SelectOpenAiVersion from "./SelectOpenAiVersion";
import PromptHistoryList from "./prompt/PromptHistory/PromptHistoryList";
import { Forma } from "forma-embedded-view-sdk/auto";


export default function Sidebar() {
  // const [polygonId, setPolygonId] = useState<string | null>(null)
  // const [polygon, setPolygon] = useState<Vec3[]>([])
  // const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([])
  const [openAiVersion, setOpenAiVersion] = useState<number>(2)
  Forma.onEmbeddedViewStateChange(({ embeddedViewId, state }) => {
    if (embeddedViewId !== "floating-panel") return
    if (state !== "connected") {
      window.removeEventListener('historyPushState', () => null)
      return
    }
    const handleCustomUrlChangeEvent = () => {
      const url = new URL(window.location.href);
      const query = new URLSearchParams(url.search);
      const messageId = query.get("messageId");
      Forma.createMessagePort({
        embeddedViewId: "floating-panel",
        portName: "selectedPromptMessageId"
      }).then((port) => {
        port.postMessage(messageId);
      })
    }
    handleCustomUrlChangeEvent()
    window.addEventListener('historyPushState', () => handleCustomUrlChangeEvent())
  })
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
          <Prompt />
        </div>
      </div>
      <FloatPanelOpener />
    </>
  );
}
