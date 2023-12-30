//import mongoose from "mongoose";//not required in the 2nd approach
//import { DB_NAME } from "./constants";//not required in the 2nd approach
import dotenv from "dotenv";
dotenv.config({
    path: './env'
})
import express from "express"; 
const app = express();


//SECOND APPROACH
import connectDB from "./DB/index.js";
connectDB();


//FIRST APPROACH
/*try {
    ( async()=>{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERRR",error);
            throw error
        })
    })()

} catch (error) {
    console.error("ERROR : ",error)
    throw err
}*/