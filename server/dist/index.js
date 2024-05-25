"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const express_1 = __importDefault(require("express"));
const pty = __importStar(require("node-pty"));
const cors_1 = __importDefault(require("cors"));
const getRootFileStructure_1 = require("./controller/getRootFileStructure");
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
const wss = new ws_1.WebSocketServer({ server: httpServer });
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data, isBinary) {
        const commandFromClient = data.toString();
        console.log(commandFromClient, isBinary);
        ptyProcess.write(commandFromClient);
    });
    ws.on('close', () => {
        console.log("Connection closed");
    });
    console.log("Connection made--->");
});
const ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_PWD,
    env: process.env
});
ptyProcess.onData((data) => {
    //console.log("Response->",data)
    wss.clients.forEach(function each(client) {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify({ event: 'terminalResponse', data: data }));
        }
    });
    wss.emit;
});
const cp = path_1.default.resolve(__dirname, "../../user");
chokidar_1.default.watch(cp).on('all', (event, path) => {
    console.log("File change detected");
    wss.clients.forEach(function each(client) {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify({ event: "fileChange", data: event }));
        }
    });
});
app.get("/", (req, res) => {
    res.json("Aditrya");
});
app.get("/files", getRootFileStructure_1.getRootFileStructure);
