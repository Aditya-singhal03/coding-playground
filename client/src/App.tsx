import { Editor } from "@monaco-editor/react"
import { useState } from "react"
import "@xterm/xterm/css/xterm.css"
import Terminal from "./components/Terminal";


function App() {
  const [code,setCode] = useState<string | undefined>("");
  return (
    <div>
      
      <Terminal/>
    </div>
  )
}

export default App
