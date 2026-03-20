import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

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
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverLocalPath = req.files.coverImage[0].path;
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

const loginUser = asyncHandler(async (req, res) => {
  // req.body -> data
  // username or email based access
  // find the user
  // password
  // access and refresh token
  // send cookies

  const { email, username, password } = req.body;
  console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "Username and Email is required!");
  }

  // User.findOne({email});
  // User.findOne({username});
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password Incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // send cookies
  const options = {
    // modifiable by server only
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User LoggedIn Successfully ;)"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token!");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used!");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const {
      accessToken,
      refreshToken: newRefreshToken, // renaming
    } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access Token refresh successfully! ;)"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// make separate controllers for updating file data

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname && !email) {
    throw new ApiError(400, "All fields are mandatory!");
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        // updates only specified fields
        fullname,
        email,
      },
    },
    { new: true } // return updated document
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully!"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path; // notice: file, not files

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully!"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  /* Step 1: get file — what field name? */
  const coverImageLocalPath = req.file?.path;

  /* Step 2: validate */
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing!");
  }

  /* Step 3: upload */
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  /* Step 4: check upload */
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading cover image");
  }

  /* Step 5: update DB — which field? */
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User cover image updated successfully!"));
});

const getUserChannelProfile = asyncHandler(async(req, res) => {
  const {username} = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing!");
  }

  const channel = await User.aggregate([    // return array
    {
      $match: {
        username: username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [
                  new mongoose.Types.ObjectId(req.user?._id),
                  "$subscribers.subscriber"
              ]
            },
            then: true,
            else: false,
          },
        }, 
      }
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1, 
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1, 
        coverImage: 1,
        email: 1,
      }
    }
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist!");
  }

  console.log(channel);

  return res
  .status(200)
  .json(
    new ApiResponse(200, channel[0], "User Channel fetched successfully")
  );

});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
};
