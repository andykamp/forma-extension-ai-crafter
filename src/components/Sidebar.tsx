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
  const [ selectedPromptMessage, setSelectedPromptMessage ] = useState<ProjectMessage | null>(null)

  const inputs = usePreviewInputs()

  const addPromptHistory = async (role: string, content: string) => {
    const queryParams = new URLSearchParams(window.location.search);
    const projectId = queryParams.get('projectId')

    const body = {
      projectId: projectId,
      deploymentCode: openAiVersion,
      user: content
    }

    const queryString = objectToQueryString(body)
    const url = `http://localhost:8080/submitPrompt?${queryString}`
    try {
      const result = await fetch(url, {
        method: 'GET',
      })

      if (!result.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await result.json();
      console.log('dataaaaaaaaaaaa', res);
      setSelectedPromptMessage(res.upsertResponse)

      // setResult(lastMsg);
    } catch (error) {
      console.error('Error:', error);
    }



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
