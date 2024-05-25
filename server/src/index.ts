import WebSocket, { WebSocketServer } from 'ws';
import express from 'express'
import * as pty from 'node-pty';
import cors from 'cors'
import { getRootFileStructure } from './controller/getRootFileStructure';
import chokidar from 'chokidar';
import path from 'path';

const app = express()

app.use(cors());
app.use(express.json());
const httpServer = app.listen(8080,()=>{
    console.log('Server is listening on port 8080');
})

const wss = new WebSocketServer({server:httpServer});

wss.on('connection',function connection(ws){
    ws.on('error',console.error)
    
    ws.on('message', function message(data,isBinary){
        const commandFromClient = data.toString();
        console.log(commandFromClient , isBinary);
        ptyProcess.write(commandFromClient)
    })

    ws.on('close',()=>{
        console.log("Connection closed")
    })
    
    console.log("Connection made--->")
})

const ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_PWD,
    env: process.env
  });

ptyProcess.onData((data)=>{
    //console.log("Response->",data)
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({event:'terminalResponse',data:data}));
        }
    });
    wss.emit
})

const cp = path.resolve(__dirname, "../../user");
chokidar.watch(cp).on('all', (event, path) => {
    console.log("File change detected")
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({event:"fileChange",data:event}));
        }
    });
});
  

app.get("/",(req,res)=>{
    res.json("Aditrya")
})

app.get("/files",getRootFileStructure);