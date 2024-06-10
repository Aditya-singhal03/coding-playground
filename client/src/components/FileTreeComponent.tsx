import { useState } from "react";
import traingleDown from "../assets/triangle-down-svgrepo-com.svg";
import traigleRight from "../assets/triangle-right-svgrepo-com.svg";

interface FileTreeInterface {
    path: string;
    name: string;
    children?: FileTreeInterface[]; // Optional if not all nodes have children
}

const sortNodes = (nodes: FileTreeInterface[]): FileTreeInterface[] => {
    return nodes.sort((a, b) => {
        if (a.children && !b.children) {
            return -1;
        }
        if (!a.children && b.children) {
            return 1;
        }
        return a.name.localeCompare(b.name);
    });
};

const FileTreeNode = ({
    nodeName,
    nodeChildren,
    path,
    level,
    setSelectedFilePath,
}: {
    nodeName: string;
    nodeChildren: FileTreeInterface[] | undefined;
    path: string;
    level: number;
    setSelectedFilePath: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const isDir = !!nodeChildren;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDir) {
            setIsOpen((old) => !old);
        } else {
            setSelectedFilePath(path);
        }
    };

    return (
        <div className="">
            <div className={`cursor-pointer flex items-center ${!isDir ? "ml-[20px]" : ""}`} onClick={handleClick}>
                {isDir && (
                    <img
                        src={isOpen ? traingleDown : traigleRight}
                        className="w-5 h-5"
                        alt={isOpen ? "Open Directory" : "Closed Directory"}
                    />
                )}
                <div>{nodeName}</div>
            </div>
            {isOpen && nodeChildren && (
                <div className="ml-4">
                    {sortNodes(nodeChildren).map((child) => (
                        <FileTreeNode
                            key={child.path}
                            nodeName={child.name}
                            nodeChildren={child.children}
                            path={child.path}
                            level={level + 1}
                            setSelectedFilePath={setSelectedFilePath}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const FileTreeComponent = ({
    fileTreeObject,
    setSelectedFilePath,
}: {
    fileTreeObject: FileTreeInterface | null;
    setSelectedFilePath: React.Dispatch<React.SetStateAction<string>>;
}) => {
    return (
        <div>
            {fileTreeObject && (
                <FileTreeNode
                    nodeName={fileTreeObject.name}
                    nodeChildren={sortNodes(fileTreeObject.children || [])}
                    path={fileTreeObject.path}
                    level={0}
                    setSelectedFilePath={setSelectedFilePath}
                />
            )}
        </div>
    );
};

export default FileTreeComponent;
