import { Terminal as XTerminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { FitAddon } from '@xterm/addon-fit';

const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminalText, setTerminalText] = useState('');

    
    
    const onDataFunc = useCallback((data: string, terminal: XTerminal) => {
        const code = data.charCodeAt(0);
        console.log(`Received data: ${data}, code: ${code}====> ${code===127}`);

        console.log("Current terminalText:", terminalText);
    
        if (code === 13) { // Enter key
            terminal.write(`\r\n${"Sample outwput"}\r\n`);
            setTerminalText('');
        } else if (code === 127) { // Backspace key
            if (terminalText) {
                terminal.write('\b \b'); // Erase the character from the terminal
                setTerminalText((prevState) => {
                    const updatedText = prevState.substring(0, prevState.length - 1);
                    return updatedText;
                }); 
            }
        } else {
            terminal.write(data); // Write the received data to the terminal
            setTerminalText(prev => {
                const newText = prev + data;
                return newText;
            });
        }
    },[terminalText])

    useEffect(() => {
        const terminal = new XTerminal({
            rows: 20,
            cursorBlink: true // Optional: Makes the cursor blink, useful for visibility
        });
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        console.log(terminalRef.current)
        if (terminalRef.current) {
            terminal.open(terminalRef.current);
            fitAddon.fit();
            terminal.onData(data => onDataFunc(data,terminal));
        }
        
        return () => {
            console.log("clearifsngis")
            terminal.dispose(); // Clean up the terminal instance on component unmount
        }
    }, []);

    return (
        <div ref={terminalRef} style={{ height: '100%', width: '100%' }}>
        </div>
    );
}

export default Terminal;
