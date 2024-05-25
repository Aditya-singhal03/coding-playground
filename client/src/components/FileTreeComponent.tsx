interface FileTreeInterface {
    path: string;
    name: string;
    children?: FileTreeInterface[]; // Optional if not all nodes have children
}


const FileTreeNode = ({nodeName,nodeChildren,level}:{nodeName:string,nodeChildren:FileTreeInterface[] | undefined,level:number})=>{


    return (
        <div className="ml-4">
            <div className={`${nodeChildren?"":"bg-slate-300"} m-2`}>{nodeName}</div>
            {nodeChildren && 
                <div>
                    {nodeChildren.map((child)=>{
                        return <div>
                            <FileTreeNode nodeName={child.name} nodeChildren={child.children} level={level+1}/>
                        </div>
                    })}
                </div>
            }
        </div>
    )
}

const FileTreeComponent = ({fileTreeObject}:{fileTreeObject : FileTreeInterface | null}) => {
    


    return (
        <div>
            {fileTreeObject && <FileTreeNode nodeName={fileTreeObject.name} nodeChildren={fileTreeObject.children} level={0} />}
        </div>
    )
}

export default FileTreeComponent
