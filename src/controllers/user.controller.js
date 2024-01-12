import { asyncHandler } from "../utils/asyncHanler.js";
import { ApiError } from "../utils/APIerror.js";
import { user } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APIresponse.js";

const registerUser = asyncHandler(async (req, res) => {
   //ALGORITHM
   // get user details from frontend
   // validation - not empty
   // check if user already exists: username, email
   // check for images, check for avatar
   // upload them to cloudinary, avatar
   // create user object - create entry in db
   // remove password and refresh token field from response
   // check for user creation
   // return res




   //return res.status(200).json({message: "ok"})
   const { fullname, email, username, password } = req.body// destructuring to get info of the user in different variables
   console.log("email: ", email)




   // code for instructing the user to fill up all the fields
   if (fullname === "") {
      throw new ApiError(400, "All fields are required")
   }

   if (email === "") {
      throw new ApiError(400, "All fields are required")
   }

   if (username === "") {
      throw new ApiError(400, "All fields are required")
   }

   if (password === "") {
      throw new ApiError(400, "All fields are required")
   }





   /*
   if(
      [fullname,email,username,password].some((field) => field?.trim() === "")
   ){
      throw new ApiError(400,"All fields are required")
   }
   this is the code from hitesh sir
   */



   //check if user already exists

   const existedUser = user.findOne({ email, username })

   /*  
  hitesh sir's code 
   const existedUser = user.findOne({
        $or: [{ username },{ email }]
     })
   */


   
   //the file upload thing idk much about this one i'll learn multer and then these will be cleared
   const avatarLocalPath = req.files?.avatar[0]?.path ;
   const coverImageLocalPath = req.files?.coverImage[0]?.path ;   //multer gives more properties to the req
   if(!avatarLocalPath){
      throw new ApiError(400, "Avatar file is required")
   }



   //uploading files to cloudinary 

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  
   if(!avatar) {
      throw new ApiError(400, "Avatar is required")
   }


   //creating user in database

   const User = user.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "", // here after coverImage a question mark is given because coverImage is not set as a required field so if it is given by user it is used but if not given the or part that is an empty string is used
      email,
      password,
      username
   })

   //check if user is created or something wen5t wrong

const createdUser = await user.findById(User._id).select(
      "-password -refreshToken"//removing pass and refresh token
   )

   if(!createdUser){
      throw new ApiError(500,"somethign went wrong while creating user")
   }



   //returning response 

   return res.status(201).json(
      new ApiResponse(200,createdUser,"registered successfully")
   )
})//this code is run in the user.route.js file

export { registerUser };