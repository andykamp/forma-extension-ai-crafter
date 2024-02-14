import { useEffect, useState } from "preact/hooks";

type Version = {
  Code: number;
  Name: string;
  Url: string;
  ApiKey: string;
  Max_tokens: number | null;
  Temperature: number;
  Frequency_penalty: number;
  Presence_penalty: number;
  Top_p: number;
  Stop: string | null;
  Messages: string[]; // Assuming Messages is an array of strings
};

export type SelectOpenAiVersionProps = {
  value: number,
  onChange: (openAiVersion: number) => void
}

export default function SelectOpenAiVersion(props: SelectOpenAiVersionProps) {
  const {
    value,
    onChange
  } = props
  const [options, setOptions] = useState<Version[]>([]);

  const fetchOptions = async () => {
    try {
      const url = `http://localhost:8080/Get_Gpt_Deployments`
      const result = await fetch(url, {
        method: 'GET',
      })

      if (!result.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await result.json();
      console.log('dataaaaaaaaaaaa', res);
      setOptions(res)

      // setResult(lastMsg);
    } catch (error) {
      console.error('Error:', error);
    }
  }


  useEffect(() => {
    fetchOptions()
  }, []);

  return (
    <div class="row">
      <div class="row-item w-full">
        <weave-select
          value={value}
          onChange={(event) => {
            const value = (event as CustomEvent).detail.value
            if (!value) return
            onChange(+value)
          }}
        >
          {/* // Luxon uses 1-indexed months, so we need to add 1 to the value */}
          {options.map((version) => (
            // <option key={version.id} value={version.name}>
            //   {version.name}
            // </option>
            <weave-select-option
              key={version.Code}
              value={version.Code}>
              {version.Name}
            </weave-select-option>
          ))}
        </weave-select>
      </div>
    </div>
  )
}
