interface FileTreeInterface {
    path: string;
    name: string;
    children?: FileTreeInterface[]; // Optional if not all nodes have children
}


const FileTreeNode = ({nodeName,nodeChildren,path,level,setSelectedFilePath}:{nodeName:string,nodeChildren:FileTreeInterface[] | undefined,path:string,level:number,setSelectedFilePath:React.Dispatch<React.SetStateAction<string>>})=>{

    const isDir=!!nodeChildren
    return (
        <div className="ml-4">
            <div className={`${nodeChildren?"":"bg-slate-300"} m-2 ${!isDir && "cursor-pointer"}`} onClick={(e)=>{
                e.stopPropagation();
                if(isDir) return;
                setSelectedFilePath(path)
            }}>{nodeName}</div>
            {nodeChildren && 
                <div>
                    {nodeChildren.map((child)=>{
                        return <div>
                            <FileTreeNode 
                                nodeName={child.name} 
                                nodeChildren={child.children} 
                                path={child.path}
                                level={level+1} 
                                setSelectedFilePath={setSelectedFilePath}
                            />
                        </div>
                    })}
                </div>
            }
        </div>
    )
}

const FileTreeComponent = ({fileTreeObject,setSelectedFilePath}:{fileTreeObject : FileTreeInterface | null,setSelectedFilePath:React.Dispatch<React.SetStateAction<string>>}) => {
    


    return (
        <div>
            {fileTreeObject && <FileTreeNode nodeName={fileTreeObject.name} nodeChildren={fileTreeObject.children} path={fileTreeObject.path} level={0} setSelectedFilePath={setSelectedFilePath}/>}
        </div>
    )
}

export default FileTreeComponent
