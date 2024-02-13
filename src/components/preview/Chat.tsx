import { Forma } from "forma-embedded-view-sdk/auto"
import type { PromptHistory } from "./preview"

const promptHistory: PromptHistory[] = []

export default function Chat() {
  const url = new URL(window.location.href)
  const query = new URLSearchParams(url.search)
  const getPolygon = query.get("polygon")
  const getPromptHistory = query.get("promptHistory")

  if(getPromptHistory) {
    promptHistory.push(JSON.parse(getPromptHistory))
  }


  return (
    <>
      <h1>PromptHistory</h1>
      <pre>{JSON.stringify(promptHistory, null, 2)}</pre>
    </>
  );
}

