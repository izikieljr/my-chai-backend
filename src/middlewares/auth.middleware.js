import { user } from "../models/users.model.js";
import { ApiError } from "../utils/APIerror.js";
import { asyncHandler } from "../utils/asyncHanler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
 try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    if(!token){
       throw new ApiError(401,"unauthorized user")
    }
   
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
   
    const currentUser = await user.findById(decodedToken?._id).select("-password -refreshToken")
   
    if(!currentUser){
       throw new ApiError(401,"Invalid Access token")
    }
   
    req.user = currentUser;
    next()
    
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid Access token")
}
})