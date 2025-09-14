import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB().then(()=>{
    app.on("error",()=>{console.log("ERR: ",error)})
    app.listen(process.env.PORT||8000,()=>{console.log(`Server is running at ${process.env.PORT}`)})
}).catch((error)=>{
    console.log("MONGO DB connection failed ERR: ",error)
})