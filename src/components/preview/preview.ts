import { useEffect, useState } from "preact/hooks";

type PreviewInputs = {
  projectId: string;
  polygon: [number, number][];
  promtHistory: any;
}

function safeParse(str: string) {

  // If 'polygon' is a JSON string and you expect it to be so, parse it
  let obj = null;
  if (str) {
    try {
      obj = JSON.parse(str);
    } catch (e) {
      console.error('Failed to parse polygon query parameter:', e);
    }
  }
  return obj;
}

export function usePreviewInputs() {
  const [inputs, setInputs] = useState<PreviewInputs>();

  useEffect(() => {

    // Create a URLSearchParams object from window.location.search
    const queryParams = new URLSearchParams(window.location.search);
    console.log('queryParams', queryParams);
    const i: PreviewInputs = {
      projectId: queryParams.get('projectId') || '',
      promtHistory: safeParse(queryParams.get('promtHistory') || ''),
      polygon: safeParse(queryParams.get('polygon') || ''),
    }
    setInputs(i);

    // Get the value of the 'polygon' query parameter
  }, []);


  return inputs
}
