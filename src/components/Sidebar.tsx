import { FloatPanelOpener } from "./preview/FloatPanelOpener";
import { useState } from "preact/hooks";
import SelectArea from "./SelectArea";
import Prompt from "./prompt/Prompt";
import { usePreviewInputs, type PromptHistory } from "./preview/preview";
import "./styles.css";
import type { Vec3 } from "forma-embedded-view-sdk/dist/internal/scene/design-tool";
import SelectOpenAiVersion from "./SelectOpenAiVersion";
import PromptHistoryList, { type ProjectMessage } from "./prompt/PromptHistory/PromptHistoryList";

function objectToQueryString(json:any) {
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}


export default function Sidebar() {
  const [polygonId, setPolygonId] = useState<string | null>(null)
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([])
  const [prompt, setPrompt] = useState<string>("")
  const [polygon, setPolygon] = useState<Vec3[]>([])
  const [openAiVersion, setOpenAiVersion] = useState<number>(2)
  const [selectedPromptMessage, setSelectedPromptMessage ] = useState<ProjectMessage | null>(null)

  return (
    <>
      <div className={"sidebar-wrapper"}>
        <SelectArea
          polygonId={polygonId}
          onDrawnPolygon={setPolygonId}
          onPolygon={setPolygon}
        />
        <div>
          <SelectOpenAiVersion
            value={openAiVersion}
            onChange={(version) => {
              setOpenAiVersion(version)
            }}
          />
          <Prompt
            value={prompt}
            onPromptChange={(prompt) => {
              setPrompt(prompt)
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
            onPromptSubmitLoading={(loading) => { 
              // handle loading
            }}
            onPromptSubmitError={(error) => { 
              // handle error
            }}
          />
          <PromptHistoryList
            onPromptMessageClick={(promptMessage) => {
              setSelectedPromptMessage(promptMessage)
            }}
            selectedPromptMessage={selectedPromptMessage}
          />
        </div>
      </div>
      <FloatPanelOpener
        polygon={polygon}
        promptHistory={promptHistory}
        selectedPrompMessageId={selectedPromptMessage?.Id || 0}
      />
      {/* <DaylightSection/>
      <TestMeshSection/>
      <TestInfoSection/>
      <FloatPanelOpener/> 
      <FloatPanelOpener/> */}
    </>
  );
}
