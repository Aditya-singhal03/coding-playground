import { Editor } from "@monaco-editor/react"
import "@xterm/xterm/css/xterm.css"
import Terminal from "../components/Terminal";
import FileTreeComponent from "../components/FileTreeComponent";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Terminal as XTerminal } from "@xterm/xterm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { editor } from "monaco-editor";
import { RxCross1 } from "react-icons/rx";
import IframeComponent from "../components/IframeComponent";

interface FileTreeInterface {
  path: string;
  name: string;
  children?: FileTreeInterface[]; // Optional if not all nodes have children
}

const Playground = () => {
    const newSocket = useRef<WebSocket | null>(null)
    const [fileTreeObject,setFileTreeObject] = useState<FileTreeInterface | null>(null)
    const [selectedFilePath,setSelectedFilePath] = useState<string>("")
    const [selectedFileCode,setSelectedFileCode] = useState<string>("")
    const [code,setCode] = useState<string | undefined>("")
    const [terminal,setTerminal] = useState<XTerminal | null>(null)
    const stateRef = useRef<XTerminal | null>(null);
    stateRef.current = terminal;
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    //const previewIframeRef = useRef<HTMLIFrameElement | null>(null)
  
    //multi tab support states
    const [modelLanguage,setModelLanguage] = useState<string>("");
    const [tabsArray,setTabsArray] = useState<FileTreeInterface[]>([]);
    const [tabSelected,setTabSelected] = useState<number>(0);
    // const 
  
    const isSaved = selectedFileCode===code
  
      const fetchFileStructure = async (eventFromChokidar?:string)=>{
          try{
              if(eventFromChokidar==='change') return;
              const {data} = await axios.get("http://localhost:30007/node4896_main/files");
              console.log(data)
              setFileTreeObject(data.msg)
          }catch(err){
              console.log("Error fetching file Tree",err)
          }
      }
  
    useEffect(() => {
        newSocket.current = new WebSocket('ws://localhost:30007/node4896_main');

        newSocket.current.onopen = () => {
            console.log('Connection established');
        };

        newSocket.current.onmessage = (message) => {
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
        };

        newSocket.current.onclose = () => {
            console.log("Connection closed");
        };

        return () => {
            newSocket.current?.close();
        };
    }, []);
  
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
          if(selectedFilePath.length>0) newSocket.current?.send(JSON.stringify({event:"saveCode",data:JSON.stringify({code:code,path:selectedFilePath})}))
        },5000)
        return ()=>clearTimeout(debounce)
      }
    },[code,isSaved,selectedFilePath])
  
    const fetchFileCode = useCallback(async ()=>{
      try{
        const {data} = await axios.get("http://localhost:30007/node4896_main/file/content",{
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
  
    const getCodeLanguage = useCallback(()=>{
      const dotArray = selectedFilePath.split('.');
      const shortLanguage = dotArray[dotArray.length - 1].toLowerCase(); // Convert to lowercase to handle case variations
      switch (shortLanguage) {
          case 'js':
          case 'mjs':
          case 'cjs':
              setModelLanguage('javascript');
              break;
          case 'ts':
              setModelLanguage('typescript');
              break;
          case 'jsx':
              setModelLanguage('jsx');
              break;
          case 'tsx':
              setModelLanguage('tsx');
              break;
          case 'json':
              setModelLanguage('json');
              break;
          case 'html':
          case 'htm':
              setModelLanguage('html');
              break;
          case 'css':
              setModelLanguage('css');
              break;
          case 'scss':
          case 'sass':
              setModelLanguage('scss');
              break;
          case 'less':
              setModelLanguage('less');
              break;
          case 'xml':
          case 'xsd':
          case 'xslt':
          case 'svg':
              setModelLanguage('xml');
              break;
          case 'yaml':
          case 'yml':
              setModelLanguage('yaml');
              break;
          case 'md':
          case 'markdown':
              setModelLanguage('markdown');
              break;
          case 'py':
              setModelLanguage('python');
              break;
          case 'rb':
              setModelLanguage('ruby');
              break;
          case 'php':
              setModelLanguage('php');
              break;
          case 'java':
              setModelLanguage('java');
              break;
          case 'c':
              setModelLanguage('c');
              break;
          case 'cpp':
          case 'cc':
          case 'cxx':
              setModelLanguage('cpp');
              break;
          case 'cs':
              setModelLanguage('csharp');
              break;
          case 'go':
              setModelLanguage('go');
              break;
          case 'swift':
              setModelLanguage('swift');
              break;
          case 'rs':
              setModelLanguage('rust');
              break;
          case 'sh':
          case 'bash':
              setModelLanguage('shell');
              break;
          case 'bat':
              setModelLanguage('bat');
              break;
          case 'sql':
              setModelLanguage('sql');
              break;
          case 'r':
              setModelLanguage('r');
              break;
          case 'lua':
              setModelLanguage('lua');
              break;
          case 'pl':
          case 'pm':
              setModelLanguage('perl');
              break;
          case 'kt':
          case 'kts':
              setModelLanguage('kotlin');
              break;
          case 'dart':
              setModelLanguage('dart');
              break;
          case 'coffee':
              setModelLanguage('coffeescript');
              break;
          case 'ini':
              setModelLanguage('ini');
              break;
          case 'toml':
              setModelLanguage('toml');
              break;
          case 'vb':
              setModelLanguage('vb');
              break;
          case 'matlab':
              setModelLanguage('matlab');
              break;
          case 'groovy':
              setModelLanguage('groovy');
              break;
          default:
              setModelLanguage('plaintext');
              break;
      }
    },[selectedFilePath])
  
    const hadleTabFunctionality = useCallback(()=>{
      const arr = selectedFilePath.split('/');
      const fileName = arr[arr.length-1];
      const tabArrayLength = tabsArray.length;
      const indexTab = tabsArray.findIndex(tab=>tab.path===selectedFilePath);
      console.log(indexTab," ",tabArrayLength," ",fileName)
      if(indexTab!==-1){
        console.log("already in tab array")
        setTabSelected(indexTab)
      }else{
        setTabsArray(old=>[...old,{
          path:selectedFilePath,
          name:fileName
        }])
        setTabSelected(tabArrayLength);
      }
    },[selectedFilePath,tabsArray]) 
  
    console.log(tabSelected)
    console.log(tabsArray)
    console.log(selectedFilePath)
  
    useEffect(()=>{
      if(selectedFilePath.length>0){
        fetchFileCode()
        getCodeLanguage()
        hadleTabFunctionality()
      }
    },[selectedFilePath,fetchFileCode,getCodeLanguage,hadleTabFunctionality])
  
    const handleEditorChange = async (value:string | undefined)=>{
      setCode(value)
    }
  
    useEffect(() => {
      editorRef.current?.focus();
    }, [selectedFilePath]);
  
    const handleTabDelete=(tabPath:string,tabIdx:number)=>{
      const isFilePathChange = tabIdx===tabsArray.length-1 || tabSelected===tabIdx
      const newTabArray = tabsArray.filter(tab=>tab.path!==tabPath);
      setTabsArray(newTabArray);
      if(isFilePathChange) setSelectedFilePath(newTabArray.length>0?newTabArray[newTabArray.length-1].path:"");
      //setTabSelected(newTabArray.length>0?newTabArray.length-1:0);
    }
  
    // const updatePreview = ()=>{
    //   if(previewIframeRef.current){
    //     const previewUrl = "http://100.0.226.146:1337/";
    //     previewIframeRef.current.src = previewUrl;
    //   }
    // }
  
    // useEffect(()=>{
    //   updatePreview();
    // },[])
  
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
          <ResizablePanel defaultSize={60}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={45} maxSize={100}>
                  <div className="flex justify-start border-y-4 border-x-0">
                    {tabsArray.map((tab,idx)=>{
                      return (
                        <div key={idx} className={`flex px-2 border-x-2 items-center gap-1 ${tabSelected===idx?"bg-slate-200":""}`}>
                          <button onClick={()=>{
                            setSelectedFilePath(tab.path)
                          }}>{tab.name}</button>
                          <button onClick={()=>handleTabDelete(tab.path,idx)}>
                            <RxCross1 size={20} className="p-1 hover:bg-slate-300 rounded-lg"/>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <div className="p-1">{selectedFilePath.split('/').join('>')}</div>
                  {selectedFilePath===""?(<div>
                    no code
                  </div>):(
                    <Editor
                      onChange={handleEditorChange}
                      value={code}
                      className=""
                      language="javascript"
                      theme="vs-dark"
                      path={selectedFilePath}
                      defaultValue={selectedFileCode}
                      defaultLanguage={modelLanguage}
                      onMount={(editor) => (editorRef.current = editor)}
                    />
                  )}
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={55} maxSize={100} className="">
                <Terminal setTerminal={setTerminal} newSocket={newSocket}/>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle/>
          <ResizablePanel defaultSize={20}>
            <IframeComponent/>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    )
}

export default Playground