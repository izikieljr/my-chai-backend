import { Router } from "express";
import { logoutUser, loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(upload.fields([{name: 'avatar', maxCount:1},{name: 'coverImage', maxCount:1}]),registerUser)//if user wants to go to /register route then this code is executed and the registerUser function is run which is in another file 'user.controller.js' 

router.route("/login").post(loginUser)

// router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/logout").post(verifyJWT,logoutUser)

export default router