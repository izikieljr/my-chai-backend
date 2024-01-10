import {asyncHandler} from "../utils/asyncHanler.js";

const registerUser = asyncHandler( async (req,res) => {
    res.status(200).json({message: "ok"})
})//this code is run in the user.route.js file

export {registerUser};