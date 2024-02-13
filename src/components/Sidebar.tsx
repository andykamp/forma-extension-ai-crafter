import { FloatPanelOpener } from "./preview/FloatPanelOpener";
import { useState } from "preact/hooks";
import SelectArea from "./SelectArea";
import Prompt from "./prompt/Prompt";
import type { PromptHistory } from "./preview/preview";
import "./styles.css";

export default function Sidebar() {
  const [polygonId, setPolygonId] = useState<string | null>(null)
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([])
  const [prompt, setPrompt] = useState<string>("")

  const addPromptHistory = (role: string, message: string) => {
    setPromptHistory([
      ...promptHistory,
      {
        role,
        message
      }
    ])
  }
  return (
    <>
      <div className={"sidebar-wrapper"}>
        <SelectArea
          polygonId={polygonId}
          onDrawnPolygon={setPolygonId}
        />
        <Prompt
          value={prompt}
          // onPromptChange={setPrompt}
          onPromptChange={(prompt) => {
            setPrompt(prompt)
            addPromptHistory("User", prompt)
           }}
        />
      </div>
      <FloatPanelOpener
        polygonId={polygonId}
        promptHistory={promptHistory}
      />
      {/* <DaylightSection/>
      <TestMeshSection/>
      <TestInfoSection/> */}
    </>
  );
}
