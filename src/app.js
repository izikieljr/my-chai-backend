import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))//data from form
app.use(express.urlencoded({extended: true, limit: "16kb"}))//data from url
app.use(express.static("public"))//some images pdfs etc i want to store in my server only is put in the folder name "public"
app.use(cookieParser())//use the cookies of the user using CRUD operation

//routes import
import userRouter from "./routes/user.route.js"

//routes declaration 
app.use("/api/v1/users", userRouter)//in this line the 'userRouter' has been imported from the routes folder and this is used to redirect the code to the file 'user.route.js'

/* this will lead to this url "http://localhost:8000/api/v1/users/:slug" */

export { app };

//1. take the data from a from
//2. chcek wetjher the creddentials are correct
//3. log in if true else show error msg