import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("req.files →", req.files);
  console.log("req.body  →", req.body);

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

  const existedUser = await User.findOne({
    // User directly communicates with db
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists!");
  }

  // multer gives req.files access jus like express gives access to req.body
  const avatarLocalPath = req.files?.avatar?.[0]?.path; // need first property
  // const coverLocalPath = req.files?.coverImage?.[0]?.path;

  // classical way
  let coverLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.lenth > 0) {
    coverLocalPath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is mandatory!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);

  console.log("TYPE:", typeof req.files?.avatar);
  console.log("AVATAR ARRAY:", req.files?.avatar);
  console.log("FIRST ITEM:", req.files?.avatar?.[0]);
  console.log("PATH:", req.files?.avatar?.[0]?.path);

  if (!avatar) {
    throw new ApiError(400, "avatar is mandatory!");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.secure_url,
    // coverImage: coverImage.url,
    coverImage: coverImage?.secure_url || "", // handle corner cases, otherwise db will blast
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken " // fields we don't required
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user!");
  }

  //  return reponse with proper api response

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "message user registered successfully")
    );
});

export { registerUser };
