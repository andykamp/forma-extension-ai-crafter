import "./styles.css"

export type PromptProps = {
  value: string,
  onPromptChange: (prompt: string) => void
}
export default function Prompt(props: PromptProps) {
  const {
    value,
    onPromptChange
  } = props

  return (
    <div>
      <span>
        Prompt:
      </span>
      <textarea
        className={"prompt-textarea"}
        value={value}
        onChange={(e) => {
          if(!e?.target) return
          const value = (e.target as any).value
          onPromptChange(value)
        }}
      />
    </div>
  )
}
