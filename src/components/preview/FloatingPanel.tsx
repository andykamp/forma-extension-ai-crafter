import { useState } from "preact/hooks"
import { usePreviewInputs } from "./preview";
import GptThreeViewer from "./GptThreeViewer";
import PromptHistoryList, { type ProjectMessage } from "../prompt/PromptHistory/PromptHistoryList";
export default function FloatPanel() {
  const [ selectedPromptMessage, setSelectedPromptMessage ] = useState<ProjectMessage | null>(null)

  const inputs = usePreviewInputs();

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
    <>
      <div class="section">
        <PromptHistoryList
          projectId={inputs?.projectId || ""}
          onPromptMessageClick={(promptMessage) => {
            setSelectedPromptMessage(promptMessage)
          }}
          selectedPromptMessage={selectedPromptMessage}
        />
        <p>Actions:</p>
        {selectedPromptMessage
          ? <GptThreeViewer
              key={selectedPromptMessage.Id}
              code={selectedPromptMessage.Assistant}
          />
          : <p>No prompt selected</p>
        }
      </div>
    </>
  );
}
