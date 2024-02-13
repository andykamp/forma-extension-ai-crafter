import { useCallback, useEffect, useState } from "preact/hooks";
import type { ProjectMessage } from "./PromptHistory/PromptHistoryList";
import "./styles.css"

function objectToQueryString(json:any) {
  return Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&');
}

async function submitPrompt(user: string) {
  const queryParams = new URLSearchParams(window.location.search);
  const projectId = queryParams.get('projectId')

  const body = {
    projectId: projectId,
    deploymentCode: 1,
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

function useSubmitPrompt() {
  const [result, setResult] = useState<ProjectMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const submit = useCallback(async (user: string) => {
    setIsLoading(true)
    try {
      const projectMessages = await submitPrompt(user)
      setResult(projectMessages)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
    return result
  }, [])

  return { submit, result, isLoading, error }

}

export type PromptProps = {
  onPromptChange: (prompt: string) => void,
  onPromptSubmit?: (projectMessage: ProjectMessage) => void,
  onPromptSubmitLoading?: (isLoading: boolean) => void,
  onPromptSubmitError?: (error: Error) => void
}
export default function Prompt(props: PromptProps) {
  const {
    onPromptChange,
    onPromptSubmit,
    onPromptSubmitLoading,
    onPromptSubmitError
  } = props
  const [user, setUser] = useState <string | null>(null)
  const { submit, result, isLoading, error } = useSubmitPrompt()

  useEffect(() => {
    if(!user) return
    submit(user).then(() => {
      setUser(null)
    })
    return () => {
      setUser(null)
    }
  }, [ user, submit ])
  
  useEffect(() => {
    if(!result) return
    onPromptSubmit?.(result)
  }, [result])
  
  useEffect(() => {
    onPromptSubmitLoading?.(isLoading)
  }, [isLoading])

  useEffect(() => {
    if(!error) return
    onPromptSubmitError?.(error)
  }, [error])

  return (
    <textarea
      className={"prompt-textarea"}
      placeholder={"Type your prompt here..."}
      disabled={isLoading}
      value={isLoading ? " Loading..." : user || ""}
      onChange={(e) => {
        if(!e?.target) return
        const value = (e.target as any).value
        if(!value) return
        onPromptChange(value)
        setUser(value)
      }}
    />
  )
}
