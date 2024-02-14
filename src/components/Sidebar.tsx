import { FloatPanelOpener } from "./preview/FloatPanelOpener";
import { useState } from "preact/hooks";
import SelectArea from "./SelectArea";
import Prompt from "./prompt/Prompt";
import { type PromptHistory } from "./preview/preview";
import "./styles.css";
import type { Vec3 } from "forma-embedded-view-sdk/dist/internal/scene/design-tool";
import SelectOpenAiVersion from "./SelectOpenAiVersion";
import PromptHistoryList from "./prompt/PromptHistory/PromptHistoryList";
import type { ProjectMessage } from "../lib/types";
import { Forma } from "forma-embedded-view-sdk/auto";


export default function Sidebar() {
  const [polygonId, setPolygonId] = useState<string | null>(null)
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]) //we dont need this here. its used in the float panel but we only need to pass the id and fetch the message form the id.
  const [polygon, setPolygon] = useState<Vec3[]>([])
  const [openAiVersion, setOpenAiVersion] = useState<number>(2)
  const [selectedPromptMessage, setSelectedPromptMessage] = useState<ProjectMessage | null>(null)
  return (
    <>
      <div className={"sidebar-wrapper"}>
        {/* <SelectArea
          polygonId={polygonId}
          onDrawnPolygon={setPolygonId}
          onPolygon={setPolygon}
        /> */}
        <div>
          <SelectOpenAiVersion
            value={openAiVersion}
            onChange={(version) => {
              setOpenAiVersion(version)
            }}
          />
          <PromptHistoryList
            onPromptMessageClick={(promptMessage) => {
              setSelectedPromptMessage(promptMessage)
              Forma.createMessagePort({
                embeddedViewId: "floating-panel",
                portName: "selectedPromptMessageId"
              }).then((port) => { 
                port.postMessage(promptMessage.Id)
              })
              // const url = new URL(window.location.href)
              // const query = new URLSearchParams(url.search)
              // query.set("selectedPrompMessageId", promptMessage.Id.toString())
              // url.search = query.toString()
              // window.history.pushState({}, '', `${url.pathname}?${query.toString()}`);
              // window.dispatchEvent(new CustomEvent('urlChanged'))
            }}
            selectedPromptMessage={selectedPromptMessage}
          />
          <Prompt
            onPromptChange={(prompt) => {
              setPromptHistory([
                ...promptHistory,
                {
                  role: "User",
                  content: prompt
                }
              ])
            }}
            onPromptSubmit={(projectMessage) => { 
              setSelectedPromptMessage(projectMessage)
            }}
          />
        </div>
      </div>
      <FloatPanelOpener
        polygon={polygon}
        promptHistory={promptHistory}
        selectedPrompMessageId={selectedPromptMessage?.Id || 0}
      />
    </>
  );
}
