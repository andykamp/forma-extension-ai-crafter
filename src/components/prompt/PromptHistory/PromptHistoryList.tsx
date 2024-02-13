import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import "./promp.history.css"
import { usePreviewInputs } from "../../preview/preview";

export type ProjectMessage = {
  Id: number;
  DeploymentCode: number;
  ProjectId: string;
  User: string;
  Assistant: string;
  Prompt_tokens: number;
  Completion_tokens: number;
  Total_tokens: number;
  CreatedAt: string;
  UpdatedAt: string;
  IsDeleted: boolean;
};


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
    if(!inputs?.projectId) return
    try {
      const projectMessages = await getProjectMessages(inputs.projectId)
      setMessages(projectMessages)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [ inputs?.projectId ])
  
  useEffect(() => {
    if(!inputs?.projectId) return
    setIsLoading(true)
    setError(null)

    fetchMessages()
  }, [ inputs?.projectId ])

  return { fetchMessages, messages, isLoading, error }
}

export type PromptHistoryListProps = {
  onPromptMessageClick?: (projectMessage: ProjectMessage) => void,
  selectedPromptMessage?: ProjectMessage | null
}
export default function PromptHistoryList(props: PromptHistoryListProps) {
  const {
    onPromptMessageClick,
    selectedPromptMessage
  } = props
  const { fetchMessages, messages } = useProjectMessages()
  const lastItemRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    if(!selectedPromptMessage) return
    console.log("rerender maybe?")
    fetchMessages()
  }, [selectedPromptMessage, fetchMessages])

  useEffect(() => {
    if(!messages) return
    console.log("scrolling")
    lastItemRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div
      className={"prompt-history"}
    >
      <span
        className={"prompt-history-title"}
      >
        Prompt history:
      </span>
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
                  onPromptMessageClick?.(message)
                }}
              >
                <span>{message.User}</span>
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
