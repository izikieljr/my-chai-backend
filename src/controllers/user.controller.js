// import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHanler.js";
import { ApiError } from "../utils/APIerror.js";
import { user } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APIresponse.js";

//will be used in the login controller
const generateAccessTokenAndRefreshToken = async (userId) =>{
   try {
      const currentUser = await user.findOne(userId)
      const accessToken =  currentUser.generateAccessToken()
      const refreshToken =  currentUser.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}

   } catch (error) {
      throw new ApiError()
   }
}

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




//   return res.status(200).json({message: "ok"})
   const { fullname, email, username, password } = req.body// destructuring to get info of the user in different variables
   // console.log("email: ", email)




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

  const existedUser = await user.findOne({ email, username })

   /*  
  hitesh sir's code 
   const existedUser = user.findOne({
        $or: [{ username },{ email }]
     })
   */

     if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
  }
   
  //the file upload thing idk much about this one i'll learn multer and then these will be cleared
  
  const avatarLocalPath = req.files?.avatar[0]?.path ;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path ;   //multer gives more properties to the req
  let coverImageLocalPath;
  
  if(req.files && Array.isArray(req.files.coverImageLocalPath) && req.files.coverImageLocalPath.length > 0){
     coverImageLocalPath = req.files.coverImageLocalPath[0].path
   }
   
   console.log(req.files)
   if(!avatarLocalPath){
      throw new ApiError(401, "Avatar file is required")
   }



   //uploading files to cloudinary 

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  

   if(!avatar) {
      throw new ApiError(400, "Avatar failed to be uploaded")
   }


   //creating user in database

   const User = await user.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url, // here after coverImage a question mark is given because coverImage is not set as a required field so if it is given by user it is used but if not given the or part that is an empty string is used
      email,
      password,
      username
   })

  // check if user is created or something wen5t wrong

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


const loginUser = asyncHandler(async(req,res)=>{
   //ALGORITHM
   //take the  email username and pasword from the user as from data (destructuring from req.body)
   //go to my database to check if an user with that username email and password exists (user.findone will be used)
   //if exists check wheter password are correct
   //if corerect then use the generate and refresh  access token methods of the user which you will get when importing user from the use.models.js
   //after genrating those redirect the user to home url

   //1st step 

   const {email , username , pasword} = req.body
   


   
   //hitesh sir's code to fill up send atleast one bwetween email and username
  /* if (!username && !email) {
        throw new ApiError(400, "username or email is required")
   }*/
   //2nd step 

   //const existingUser = await user.findOne({email, username})

   
    //hitesh sir code 
    const existingUser = await user.findOne({
      $or: [{username},{email}]
    })
   



   if(!existingUser){
      throw new ApiError(404,"user does not exists")
   }

   //3rd step

   const passwordCorrect = await user.isPasswordCorrect(password)

   if(!passwordCorrect){
      throw new ApiError(401,"password is incorrect")
   }


   //4th step

   const { accessToken, refreshToken }= await generateAccessTokenAndRefreshToken(existingUser._id)

   //optional step ---   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   //5th step


   const options = {
      httpOnly: true,
      secure: true
  }//this code does not lets frontend be able to modify cookies and allows only the server to be able to modify the cookies

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )

})

const logoutUser = asyncHandler(async(req, res) => {
   await User.findByIdAndUpdate(
       req.user._id,
       {
           $set: {
               refreshToken: undefined // this removes the field from document
           }
       },
       {
           new: true
       }
   )

   const options = {
       httpOnly: true,
       secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged Out"))
})



export { 
   registerUser,
   loginUser,
   logoutUser
};