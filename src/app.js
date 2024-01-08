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


export { app };