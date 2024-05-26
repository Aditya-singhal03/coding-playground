import { Editor } from "@monaco-editor/react"
import "@xterm/xterm/css/xterm.css"
import Terminal from "./components/Terminal";
import FileTreeComponent from "./components/FileTreeComponent";
import newSocket from "./utils/socket";
import { useEffect, useState } from "react";
import axios from "axios";

interface FileTreeInterface {
  path: string;
  name: string;
  children?: FileTreeInterface[]; // Optional if not all nodes have children
}


function App() {

  const [terminalResponse , setTerminalResponse] = useState<string>("")
  const [fileTreeObject,setFileTreeObject] = useState<FileTreeInterface | null>(null)
  const [selectedFilePath,setSelectedFilePath] = useState<string>("")
  const [code,setCode] = useState<string | undefined>("")

    const fetchFileStructure = async (eventFromChokidar:string)=>{
        try{
            if(eventFromChokidar==='change') return;
            const {data} = await axios.get("http://localhost:8080/files");
            console.log(data)
            setFileTreeObject(data.msg)
        }catch(err){
            console.log("Error fetching file Tree",err)
        }
    }

  useEffect(()=>{
    newSocket.onopen = ()=>{
        console.log('Connection established');
    }
    newSocket.onmessage = (message) => {
        console.log('Message received:', message.data);
        const parsedMessage = JSON.parse(message.data);
        const { event: eventType, data } = parsedMessage;
        switch (eventType) {
          case 'terminalResponse':
            setTerminalResponse(data);
            break;
          case 'fileChange':
            fetchFileStructure(data);
            break;
          default:
            console.log(`Unknown event: ${eventType}`);
        }
    }
    newSocket.onclose = ()=>{
        console.log("Connection closed")
    }
    return () => newSocket.close();
  },[])

  useEffect(()=>{
    fetchFileStructure()
  },[])

  useEffect(()=>{
    const debounce = setTimeout(()=>{
      if(selectedFilePath.length>0) newSocket.send(JSON.stringify({event:"saveCode",data:JSON.stringify({code:code,path:selectedFilePath})}))
    },5000)

    return ()=>clearTimeout(debounce)
  },[code])

  const handleEditorChange = async (value:string | undefined)=>{
    setCode(value)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="basis-1/4">
          <FileTreeComponent  fileTreeObject={fileTreeObject} setSelectedFilePath={setSelectedFilePath}/>
        </div>
        <div className="basis-3/4 flex flex-col">
          <div>{selectedFilePath.split('/').join('>')}</div>
          <div className="h-full">
            <Editor
              onChange={handleEditorChange}
              className="h-full"
              language="javascript"
              defaultValue="// some comment"
              theme="vs-dark"
            />
          </div>
          <div className="">
            <Terminal terminalResponse={terminalResponse}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
