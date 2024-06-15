import express, { Request, Response } from 'express';
import cors from 'cors'
import { spinPlayground } from './controller/spinPlayground';
import dotenv from 'dotenv'
dotenv.config()

const app = express();

app.use(cors());
app.use(express.json())


app.post("/spinUpPlayground",spinPlayground)


app.get("/",(req:Request,res:Response)=>{
    res.send("Init server running brrrrr")
})

app.listen(8001,()=>{
    console.log("Server listening on 8001")
})