import { useEffect, useState } from "preact/hooks";
import Chat from "./Chat";
import { usePreviewInputs } from "./preview";

export default function FloatPanel() {
  const [isLoading, _setIsLoading] = useState(false);

  const inputs = usePreviewInputs();

  useEffect(() => {
    if(!inputs) return;
    console.log('INPUTS are ready',inputs );
    // .. call chatGPT
    
  }, [inputs]);

  return (
    <>
      <div class="section">
        <p>Floting panel</p>
        {isLoading
          ? <p>Loading...</p>
          : <Chat />
        }
      </div>
    </>
  );
}
