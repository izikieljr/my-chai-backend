//import mongoose from "mongoose";//not required in the 2nd approach
//import { DB_NAME } from "./constants";//not required in the 2nd approach
import dotenv from "dotenv";
dotenv.config({
    path: './env'
})
import { app } from "./app.js"


//SECOND APPROACH
import connectDB from "./DB/index.js";
connectDB()
    .then(() => {
        try {
            app.listen(process.env.PORT || 3000, () => {
                console.log(`APP Running on port ${process.env.PORT}`)
            })
        }
        catch (error) {
            app.on("error",(err)=>{
                console.log("ERR :",err);
                throw err
            })
        }
    })
    .catch((err) => {
        console.log("MONGO DB CONNECTION FAILED at index src : ", err);
    })


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