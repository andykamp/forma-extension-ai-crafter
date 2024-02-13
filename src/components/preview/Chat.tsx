const chatHistory = {
  "messages": [
  ]
}

export default function Chat() {
  return (
    <>
      <h1>PromtHistory</h1>
      <pre>{JSON.stringify(chatHistory, null, 2)}</pre>
    </>
  );
}

