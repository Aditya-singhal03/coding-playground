// some comment
const express = require('express');
const app = express();
const cors= require('cors')
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Hello from replitt clone")
})

app.listen(8000,()=>{
    console.log("app listening on port 8000")
})