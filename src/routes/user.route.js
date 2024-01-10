import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerUser)//if user wants to go to /register route then this code is executed and the registerUser function is run which is in another file 'user.controller.js' 

export default router