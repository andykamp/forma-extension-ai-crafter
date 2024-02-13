const openAiVersions = [
  {
    id: 1,
    name: "GPT-3.5 Turbo"
  },
  {
    id: 2,
    name: "GPT-4.0"
  }
]
export type SelectOpenAiVersionProps = {
  value: number,
  onChange: (openAiVersion: number) => void
}

export default function SelectOpenAiVersion(props: SelectOpenAiVersionProps) {
  const {
    value,
    onChange
  } = props
  return (
    <div>
      <label htmlFor="openai-version">
        OpenAI Version:
      </label>
      <weave-select
        value={value}
        onChange={(event) => {
          const value = (event as CustomEvent).detail.value
          if(!value) return
          onChange(+value)
        }}
      >
        {/* // Luxon uses 1-indexed months, so we need to add 1 to the value */}
        {openAiVersions.map((version) => (
          // <option key={version.id} value={version.name}>
          //   {version.name}
          // </option>
          <weave-select-option
            key={version.id}
            value={version.id}>
            {version.name}
          </weave-select-option>
        ))}
      </weave-select>
    </div>
  )
}
