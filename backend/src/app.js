import express from "express"
import cors from "cors"
import path from "path";
import fileRouter from "./routers/files.router.js"


const app=express();

app.use(cors());
app.use(express.json());

app.use('/uploads',express.static('uploads'));
app.use('/api/files',fileRouter);

app.get('/health',(req,res)=>{
    res.json({status:"OK",uptime:process.uptime()});
});


export default app;