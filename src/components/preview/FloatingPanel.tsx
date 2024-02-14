import { useState, useCallback, useEffect } from "preact/hooks"
import GptThreeViewer from "./GptThreeViewer";
import type { ProjectMessage } from "../../lib/types";

async function getMessageById(messageId: string) { 
  const result = await fetch(`http://localhost:8080/getMessage?id=${messageId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => response.json())
  return result as ProjectMessage
}

function useGetMessageById(messageId: string | null) {
  const [message, setMessage] = useState<ProjectMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fetchMessage = useCallback(async (messageId: string) => {
    setIsLoading(true)
    try {
      const projectMessage = await getMessageById(messageId)
      setMessage(projectMessage)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])
  console.log(messageId)
  useEffect(() => {
    if(!messageId) return
    fetchMessage(messageId)
  }, [ messageId, fetchMessage ])
  return { message, isLoading, error }
}

export default function FloatPanel() {
  const [ selectedPromptMessage, setSelectedPromptMessage ] = useState<ProjectMessage | null>(null)
  
  const [messageId, setMessageId] = useState<string | null>(null);

  useEffect(() => {
    const handleUrlChange = () => {
      // Your existing code to handle URL change
      console.log("this sohuld trigger")
    };
  
    // Listen for the custom event
    window.addEventListener('urlChanged', handleUrlChange);
  
    // Call initially in case the URL is already set
    handleUrlChange();
  
    return () => {
      window.removeEventListener('urlChanged', handleUrlChange);
    };
  }, []);

  // const handleChatPrompt = async () => {
  //   const oldPromptHistory = [
  //     {
  //       "role": "system",
  //       "content": "You are an AI assistant that helps people find information."
  //     },
  //   ]

  //   const previewInputs = {
  //     projectId: 'your_project_id', // Replace with your actual project ID
  //     polygon: [[1, 2], [3, 4]], // Example polygon coordinates
  //     promptHistory: [
  //       ...oldPromptHistory,
  //       {
  //         "role": "user",
  //         "content": "Create a building"
  //       }
  //     ]
  //   };

  //   try {
  //     const result = await fetch('http://localhost:8080/chat', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(previewInputs)
  //     });

  //     if (!result.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await result.json();
  //     const lastMsg = data.choices[0].message.content;

  //     // setResult(lastMsg);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  // useEffect(() => {
  //   if (!inputs) return;
  //   console.log('INPUTS are ready', inputs);

  //   // simulate call to chatGPT
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     handleChatPrompt()
  //   }, 3000)

  // }, [inputs]);
  return (
    <div class="float-panel-container">
        {selectedPromptMessage
          ? <GptThreeViewer
              key={selectedPromptMessage.Id}
              code={selectedPromptMessage.Assistant}
          />
          : <p>No prompt selected</p>
        }
    </div>
  );
}
function useCallBack(arg0: (messageId: string) => Promise<void>, arg1: never[]) {
  throw new Error("Function not implemented.");
}

