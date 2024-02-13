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

export default function SelectOpenAiVersion() {
  return (
    <div>
      <label htmlFor="openai-version">
        OpenAI Version
      </label>
      <select
        id="openai-version"
        onChange={(e) => { console.log(e)}}
      >
        {openAiVersions.map((version) => (
          <option key={version.id} value={version.name}>
            {version.name}
          </option>
        
        ))}
      </select>
    </div>
  )
}
