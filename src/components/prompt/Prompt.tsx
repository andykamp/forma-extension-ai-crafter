import { useCallback, useEffect, useState } from "preact/hooks";
import "./styles.css"
import type { ProjectMessage } from "../../lib/types";

function objectToQueryString(json:any) {
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}

async function submitPrompt(user: string, versionId:number) {
  const queryParams = new URLSearchParams(window.location.search);
  const projectId = queryParams.get('projectId')

  const body = {
    projectId: projectId,
    deploymentCode: versionId,
    user
  }

  const queryString = objectToQueryString(body)
  const url = `http://localhost:8080/submitPrompt?${queryString}`
  // try {
  //   const result = await fetch(url, {
  //     method: 'GET',
  //   })

  //   if (!result.ok) {
  //     throw new Error('Network response was not ok');
  //   }

  //   const res = await result.json();

  //   // setResult(lastMsg);
  // } catch (error) {
  //   console.error('Error:', error);
  // }
  // return res as ProjectMessage
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => response.json())
  return result as ProjectMessage
}

function useSubmitPrompt(versionId:number) {
  const [result, setResult] = useState<ProjectMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const submit = useCallback(async (user: string) => {
    setIsLoading(true)
    try {
      const projectMessages = await submitPrompt(user, versionId)
      setResult(projectMessages)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
    return result
  }, [versionId])

  return { submit, result, isLoading, error }

}

export type PromptProps = {
  versionId: number,
  onPromptChange?: (prompt: string) => void,
  onPromptSubmit?: (projectMessage: ProjectMessage) => void,
  onPromptSubmitLoading?: (isLoading: boolean) => void,
  onPromptSubmitError?: (error: Error) => void
}
export default function Prompt(props: PromptProps) {
  const {
    versionId,
    onPromptChange,
    onPromptSubmit,
    onPromptSubmitLoading,
    onPromptSubmitError
  } = props
  const [user, setUser] = useState <string | null>(null)
  const { submit, result, isLoading, error } = useSubmitPrompt(versionId)

  useEffect(() => {
    onPromptSubmitLoading?.(isLoading)
  }, [isLoading])

  useEffect(() => {
    if(!error) return
    onPromptSubmitError?.(error)
  }, [error])

  const onSubmit = useCallback(() => {
    if(!user) return
    submit(user).then(() => { 
      setUser(null)
      // set message id in query param
      const url = new URL(window.location.href)
      const query = new URLSearchParams(url.search)
      if(!result?.Id) return
      query.set("messageId", result.Id.toString())
      url.search = query.toString()
      window.history.pushState({}, '', `${url.pathname}?${query.toString()}`)
      window.dispatchEvent(new CustomEvent('historyPushState', { detail: { messageId: result.Id.toString() }}));
    })
  }, [user, submit])

  return (
    <div className={"section"}>
      <textarea
        className={"prompt-textarea"}
        placeholder={"Type your prompt here..."}
        disabled={isLoading}
        value={isLoading ? " Loading..." : user || ""}
        onChange={(e) => {
          if(!e?.target) return
          const value = (e.target as any).value
          if(!value) return
          setUser(value)
        }}
      />
      <weave-button
        variant="solid"
        disabled={isLoading}
        onClick={onSubmit}
      >
        {isLoading ? "Loading...": "Submit"}
      </weave-button>
    </div>
  )
}
