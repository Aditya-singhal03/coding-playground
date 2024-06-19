import WebSocket, { WebSocketServer } from 'ws';
import express, { NextFunction, Request,Response } from 'express'
import * as pty from 'node-pty';
import cors from 'cors'
import { getRootFileStructure } from './controller/getRootFileStructure';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';

const app = express()

app.use(cors());
app.use(express.json());

app.use("*", (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    next();
});
const httpServer = app.listen(3000,()=>{
    console.log('Server is listening on port 3000');
})

if(!fs.existsSync("/workdir")){
    fs.mkdirSync("/workdir", { recursive: true });
    console.log(`Directory /workdir created.`);
}


const wss = new WebSocketServer({server:httpServer});

interface incomingMessage{
    event:string,
    data:string,
}

wss.on('connection',function connection(ws){
    ws.on('error',console.error)
    
    ws.on('message', function message(data,isBinary){
        const stringData = data.toString();
        const parsedData : incomingMessage = JSON.parse(stringData);

        if(parsedData.event=="terminalCommand"){
            console.log(parsedData.data , isBinary);
            ptyProcess.write(parsedData.data)
        }else if(parsedData.event=="saveCode"){
            saveCode(parsedData.data)
        }
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
    cwd: "/workdir",
    env: process.env
  });

ptyProcess.onData((data)=>{
    console.log("Response->",data)
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({event:'terminalResponse',data:data}));
        }
    });
    wss.emit
})


chokidar.watch("/workdir").on('all', (event, path) => {
    //console.log("File change detected")
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({event:"fileChange",data:event}));
        }
    });
});

const saveCode = async (data:string)=>{
    const parsedData:{code:string,path:string} = JSON.parse(data);
    const code=  parsedData.code;
    const pathToFile  = parsedData.path;

    // console.log(code);
    // console.log(pathToFile)
    try{
        await fs.promises.writeFile(pathToFile,code)
        console.log("code saved")
    }catch(err){
        console.log("Error saving code-->",err)
    }
}
  

app.get("/",(req,res)=>{
    res.json("Aditrya")
})

app.get("/file/content",async (req:Request,res:Response)=>{
    const path = req.query.path as string;
    try {
        const codeFromFile = await fs.promises.readFile(path, 'utf-8');
        return res.json({status:true,data:codeFromFile})
    } catch (error) {
        console.log("Error feteching code",error)
        return res.json({status:false,data:"Error fetcing code"})
    }
})



app.get("/files",getRootFileStructure);