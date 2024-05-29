import { Editor } from "@monaco-editor/react"
import "@xterm/xterm/css/xterm.css"
import Terminal from "./components/Terminal";
import FileTreeComponent from "./components/FileTreeComponent";
import newSocket from "./utils/socket";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Terminal as XTerminal } from "@xterm/xterm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

interface FileTreeInterface {
  path: string;
  name: string;
  children?: FileTreeInterface[]; // Optional if not all nodes have children
}


function App() {
  const [fileTreeObject,setFileTreeObject] = useState<FileTreeInterface | null>(null)
  const [selectedFilePath,setSelectedFilePath] = useState<string>("")
  const [selectedFileCode,setSelectedFileCode] = useState<string>("")
  const [code,setCode] = useState<string | undefined>("")
  const [terminal,setTerminal] = useState<XTerminal | null>(null)
  const stateRef = useRef<XTerminal | null>(null);
  stateRef.current = terminal;

  const isSaved = selectedFileCode===code

    const fetchFileStructure = async (eventFromChokidar?:string)=>{
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

  const setTerminalResponse = (data:string)=>{
    console.log("writing",stateRef.current)
    stateRef.current && stateRef.current.write(data);
  }

  useEffect(()=>{
    fetchFileStructure()
  },[])

  useEffect(()=>{
    if(selectedFilePath){
      setCode(selectedFileCode)
    }
  },[selectedFileCode,selectedFilePath])

  useEffect(()=>{
    if(code && !isSaved){
      const debounce = setTimeout(()=>{
        if(selectedFilePath.length>0) newSocket.send(JSON.stringify({event:"saveCode",data:JSON.stringify({code:code,path:selectedFilePath})}))
      },5000)
      return ()=>clearTimeout(debounce)
    }
  },[code,isSaved,selectedFilePath])

  const fetchFileCode = useCallback(async ()=>{
    try{
      const {data} = await axios.get("http://localhost:8080/file/content",{
        params:{
          path:selectedFilePath
        }
      });
      if(data.status){
        setSelectedFileCode(data.data)
      }
    }catch(err){
      console.log("Error fethcing code from backend");
      console.log(err)
    }
  },[selectedFilePath]) 

  useEffect(()=>{
    if(selectedFilePath.length>0) fetchFileCode()
  },[selectedFilePath,fetchFileCode])

  const handleEditorChange = async (value:string | undefined)=>{
    setCode(value)
  }

  return (
    <div className="h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className=" rounded-lg border "
      >
        <ResizablePanel defaultSize={20}>
          <div className="">
            <FileTreeComponent  fileTreeObject={fileTreeObject} setSelectedFilePath={setSelectedFilePath}/>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={45} maxSize={100}>
                <Editor
                  onChange={handleEditorChange}
                  value={code}
                  className=""
                  language="javascript"
                  defaultValue="// some comment"
                  theme="vs-dark"
                />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={55} maxSize={100} className="">
              <Terminal setTerminal={setTerminal}/>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>


      // <div className="min-h-screen flex flex-col">
      //   <div className="flex flex-1">
      //     <div className="basis-1/4">
      //       <FileTreeComponent  fileTreeObject={fileTreeObject} setSelectedFilePath={setSelectedFilePath}/>
      //     </div>
      //     <div className="basis-3/4 flex flex-col">
      //       <div>{selectedFilePath.split('/').join('>')}</div>
      //       <div className="h-full">
      //         <Editor
      //           onChange={handleEditorChange}
      //           value={code}
      //           className="h-full"
      //           language="javascript"
      //           defaultValue="// some comment"
      //           theme="vs-dark"
      //         />
      //       </div>
      //       <div className="">
      //         <Terminal setTerminal={setTerminal}/>
      //       </div>
      //     </div>
      //   </div>
      // </div>
  )
}

export default App
