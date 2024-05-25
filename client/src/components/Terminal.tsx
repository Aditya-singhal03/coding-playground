import { Terminal as XTerminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef, useState } from "react";
import { FitAddon } from '@xterm/addon-fit';
import newSocket from "../utils/socket";

const Terminal = ({terminalResponse}:{terminalResponse:string}) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminal,setTerminal] = useState<XTerminal | null>(null)
    const stateRef = useRef<XTerminal | null>(null)
    stateRef.current = terminal
    
    
    const onDataFunc = (data: string) => {
        console.log(`Received data: ${data}`);
        newSocket?.send(data);
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

    useEffect(()=>{
        terminal && terminal.write(terminalResponse)
    },[terminalResponse])

    return (
        <div ref={terminalRef}>
        </div>
    );
}

export default Terminal;
