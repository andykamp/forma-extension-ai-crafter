import { FloatPanelOpener } from "./preview/FloatPanelOpener";
import { useState } from "preact/hooks";
import SelectArea from "./SelectArea";
import Prompt from "./prompt/Prompt";
import { usePreviewInputs, type PromptHistory } from "./preview/preview";
import "./styles.css";
import type { Vec3 } from "forma-embedded-view-sdk/dist/internal/scene/design-tool";
import SelectOpenAiVersion from "./SelectOpenAiVersion";
import PromptHistoryList, { type ProjectMessage } from "./prompt/PromptHistory/PromptHistoryList";

export default function Sidebar() {
  const [polygonId, setPolygonId] = useState<string | null>(null)
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([])
  const [prompt, setPrompt] = useState<string>("")
  const [polygon, setPolygon] = useState<Vec3[]>([])
  const [openAiVersion, setOpenAiVersion] = useState<string>("gpt-3")
  const [ selectedPromptMessage, setSelectedPromptMessage ] = useState<ProjectMessage | null>(null)
  
  const inputs = usePreviewInputs()

  const addPromptHistory = (role: string, content: string) => {
    setPromptHistory([
      ...promptHistory,
      {
        role,
        content
      }
    ])
  }
  return (
    <>
      <div className={"sidebar-wrapper"}>
        <SelectArea
          polygonId={polygonId}
          onDrawnPolygon={setPolygonId}
          onPolygon={setPolygon}
        />
        <div>
          <SelectOpenAiVersion />
          <Prompt
            value={prompt}
            onPromptChange={(prompt) => {
              setPrompt(prompt)
              addPromptHistory("User", prompt)
            }}
          />
          <PromptHistoryList
            projectId={inputs?.projectId || ""}
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
      />
      {/* <DaylightSection/>
      <TestMeshSection/>
      <TestInfoSection/>
      <FloatPanelOpener/> 
      <FloatPanelOpener/> */}
    </>
  );
}
