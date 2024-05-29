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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const fs_1 = require("fs");
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
        const stringData = data.toString();
        const parsedData = JSON.parse(stringData);
        if (parsedData.event == "terminalCommand") {
            console.log(parsedData.data, isBinary);
            ptyProcess.write(parsedData.data);
        }
        else if (parsedData.event == "saveCode") {
            saveCode(parsedData.data);
        }
    });
    ws.on('close', () => {
        console.log("Connection closed");
    });
    console.log("Connection made--->");
});
const cp = path_1.default.resolve(__dirname, "../../user");
const ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: cp,
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
chokidar_1.default.watch(cp).on('all', (event, path) => {
    console.log("File change detected");
    wss.clients.forEach(function each(client) {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(JSON.stringify({ event: "fileChange", data: event }));
        }
    });
});
const saveCode = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = JSON.parse(data);
    const code = parsedData.code;
    const pathToFile = parsedData.path;
    // console.log(code);
    // console.log(pathToFile)
    try {
        yield fs_1.promises.writeFile(pathToFile, code);
        console.log("code saved");
    }
    catch (err) {
        console.log("Error saving code-->", err);
    }
});
app.get("/", (req, res) => {
    res.json("Aditrya");
});
app.get("/file/content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const path = req.query.path;
    try {
        const codeFromFile = yield fs_1.promises.readFile(path, 'utf-8');
        return res.json({ status: true, data: codeFromFile });
    }
    catch (error) {
        console.log("Error feteching code", error);
        return res.json({ status: false, data: "Error fetcing code" });
    }
}));
app.get("/files", getRootFileStructure_1.getRootFileStructure);
