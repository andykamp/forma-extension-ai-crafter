import { useState, useCallback, useEffect } from "preact/hooks"
import GptThreeViewer from "./GptThreeViewer";
import type { ProjectMessage } from "../../lib/types";
import { Forma } from "forma-embedded-view-sdk/auto";

async function getMessageById(messageId: string) { 
  const result = await fetch(`http://localhost:8080/getMessage?id=${messageId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => response.json())
  return result as ProjectMessage[]
}

function useGetMessageById() {
  const [message, setMessage] = useState<ProjectMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessage = useCallback(async (messageId: string) => {
    setIsLoading(true)
    try {
      const projectMessage = await getMessageById(messageId)
      setMessage(projectMessage[0])
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
    return message
  }, [])
  
  return { fetchMessage, message, isLoading, error }
}

export default function FloatPanel() {
  const [ selectedPromptMessage, setSelectedPromptMessage ] = useState<ProjectMessage | null>(null)
  const [messageId, setMessageId] = useState<string | null>(null)
  const { fetchMessage, message, isLoading, error } = useGetMessageById()

  useEffect(() => {
    if(!messageId) return
    fetchMessage(messageId)
    setSelectedPromptMessage(null)
  }, [ messageId, fetchMessage ])

  useEffect(() => {
    if(message) {
      setSelectedPromptMessage(message)
    }
  }, [message])
  
  Forma.onMessagePort(({ portName, port }) => {
    if (portName === "selectedPromptMessageId") {
      port.onmessage = (event) => {
        const messageId = event.data
        setMessageId(messageId)
      };
    }
  })

  console.log('selectedPromptMessage',selectedPromptMessage );
  return (
    <div class="float-panel-container">
        <GptThreeViewer
            isLoading={isLoading}
            key={selectedPromptMessage?.Id || 'no-id'}
            code={selectedPromptMessage?.Assistant || ''}
        />
    </div>
  );
}
