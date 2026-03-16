import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// more controllers, more logic building
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // all possible validations
  // check if user already exists: username, email
  // check for images, check for avatar
  // if available, upload them to cloudinary, avatar
  // create user object (nosql db) - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body;
  console.log("email:", email);

  // if (fullname == "") {
  //     throw new ApiError(400, "fullname is required!");
  // }
  if (
    [fullname, email, username, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = User.findOne({
    // User directly communicates with db
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists!");
  }

  // multer gives req.files access jus like express gives access to req.body
  const avatarLocalPath = req.files?.avatar[0]?.path; // need first property
  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is mandatory!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverLocalPath)

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is mandatory!");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    // coverImage: coverImage.url,
    coverImage: coverImage?.url || "",      // handle corner cases, otherwise db will blast
    email,
    password,
    username: username.toLowerCase(),

  });

  const createdUser = await user.findById(user._id).select(     
    "-password -refreshToken "      // fields we don't required
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user!");
  }

  //  return reponse with proper api response

  return res.status(201).json(
    new ApiResponse(200, createdUser, "message user registered successfully")
  )

});

export { registerUser };
