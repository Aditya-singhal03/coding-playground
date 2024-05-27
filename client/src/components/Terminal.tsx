import { Terminal as XTerminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { FitAddon } from '@xterm/addon-fit';
import newSocket from "../utils/socket";

const Terminal = ({setTerminal}:{setTerminal:React.Dispatch<React.SetStateAction<XTerminal | null>>}) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const onDataFunc = (data: string) => {
        console.log(`Received data: ${data}`);
        newSocket?.send(JSON.stringify({event:"terminalCommand",data:data}));
    }

    useEffect(() => {
        const terminal = new XTerminal({
            
            cursorBlink: true // Optional: Makes the cursor blink, useful for visibility
        });
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        console.log(terminalRef.current)
        if (terminalRef.current) {
            terminal.open(terminalRef.current);
            fitAddon.fit();
            terminal.onData(data => onDataFunc(data));
            setTerminal(terminal);
        }
        
        return () => {
            console.log("clearing terminal")
            terminal.dispose(); // Clean up the terminal instance on component unmount
        }
    }, []);

    return (
        <div ref={terminalRef}>
        </div>
    );
}

export default Terminal;
