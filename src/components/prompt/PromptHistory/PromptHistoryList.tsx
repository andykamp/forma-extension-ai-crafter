import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import "./promp.history.css"
import { usePreviewInputs } from "../../preview/preview";
import type { ProjectMessage } from "../../../lib/types";
import { Forma } from "forma-embedded-view-sdk/auto";


async function getProjectMessages(projectId: string) {
  const result = await fetch(`http://localhost:8080/getMessagesByProjectId?projectId=${projectId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => response.json())
  return result as ProjectMessage[]
}

function useProjectMessages() {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const inputs = usePreviewInputs()
  const fetchMessages = useCallback(async () => {
    if (!inputs?.projectId) return
    try {
      const projectMessages = await getProjectMessages(inputs.projectId)
      setMessages(projectMessages)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [inputs?.projectId])

  useEffect(() => {
    if (!inputs?.projectId) return
    setIsLoading(true)
    setError(null)

    fetchMessages()
  }, [inputs?.projectId])

  return { fetchMessages, messages, isLoading, error }
}

export default function PromptHistoryList() {
  const { fetchMessages, messages } = useProjectMessages()
  const lastItemRef = useRef<HTMLLIElement | null>(null)
  const [selectedPromptMessage, setSelectedPromptMessage] = useState<ProjectMessage | null>(null)

  useEffect(() => {
    if (!selectedPromptMessage) return
    fetchMessages()
  }, [selectedPromptMessage, fetchMessages])

  useEffect(() => {
    if (!messages) return
    if (selectedPromptMessage) return
    lastItemRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    window.addEventListener('updateHistory', (e) => { 
      console.log("REEEEEEFETCH")
      fetchMessages()
    })
  }, [fetchMessages])

  return (
    <div
      className={"prompt-history"}
    >
      {/* <button onClick={fetchMessages}> */}
      {/*   Refresh */}
      {/* </button> */}
      {/* <span */}
      {/*   className={"prompt-history-title"} */}
      {/* > */}
      {/*   Prompt history: */}
      {/* </span> */}
      <ul
        className="prompt-history-list"
      >
        {messages.length === 0 ? <li>No messages</li> : null}
        {messages.map((message, index) => {
          return (
            <li
              key={message.Id}
              ref={index === messages.length - 1 ? lastItemRef : null}
              className={selectedPromptMessage?.Id === message.Id
                ? "prompt-history-item prompt-history-item-selected"
                : "prompt-history-item"
              }
              onClick={() => {
                // openFloatingPanel()
                setSelectedPromptMessage(message)
                const url = new URL(window.location.href)
                const query = new URLSearchParams(url.search)
                if (!message?.Id) return
                query.set("messageId", message.Id.toString())
                url.search = query.toString()
                window.history.pushState({}, '', `${url.pathname}?${query.toString()}`)
                window.dispatchEvent(new CustomEvent('historyPushState', { detail: { messageId: message.Id.toString() } }));
              }}
            >
              <span>{message.User} {message.DeploymentCode}</span>
              {/* <span>{message.Assistant}</span> */}
              {/* <span>{message.Prompt_tokens}</span> */}
              {/* <span>{message.Completion_tokens}</span>
                <span>{message.Total_tokens}</span> */}
              {/* <span>{message.CreatedAt}</span>
                <span>{message.UpdatedAt}</span> */}
            </li>
          )
        })
        }
      </ul>
    </div>
  )
}
