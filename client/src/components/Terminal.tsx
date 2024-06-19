import { Terminal as XTerminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { FitAddon } from '@xterm/addon-fit';


const Terminal = ({setTerminal,newSocket}:{setTerminal:React.Dispatch<React.SetStateAction<XTerminal | null>>,newSocket:React.MutableRefObject<WebSocket | null>}) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const onDataFunc = (data: string) => {
        console.log(`Received data: ${data}`);
        newSocket.current?.send(JSON.stringify({event:"terminalCommand",data:data}));
    }

    useEffect(() => {
        const terminal = new XTerminal({
            cursorBlink: true,
            fontSize: 16,
            fontFamily: '"Fira Code", monospace'
        });
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        console.log(terminalRef.current)
        if (terminalRef.current) {
            terminal.open(terminalRef.current);
            fitAddon.fit();
            terminal.onData(data => onDataFunc(data));

            setTerminal(terminal);

            
            const resizeObserver = new ResizeObserver(() => {
                fitAddon.fit();
            });

            resizeObserver.observe(terminalRef.current);

            return () => {
                resizeObserver.disconnect();
                terminal.dispose();
            };
        }
    }, []);


    return (
        <div  id="kik" className="h-full" ref={terminalRef}>
            
        </div>
    );
}

export default Terminal;
