import {Router} from 'express';
import { changeCurrentPassword, getUserChannelProfile, 
    loginUser, logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateUserAvatar, 
    updateUserCoverImage,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getWatchHistory,
} 
from '../controllers/user.controller.js';
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([     // middleware - handle multiple files
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);
// router.route("/login").post(login);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
/*
    no verifyJWT    → anyone can update avatar
    no upload()     → req.file = undefined
*/

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user".get(verifyJWT, getCurrentUser));

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);
router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
);

router.route("/channel/:username").get(
    verifyJWT,
    getUserChannelProfile
);
/*
   URL: GET /api/v1/users/channel/hello
   req.params.username = "hello"
*/

router.route("/watch-history").get(verifyJWT, getWatchHistory);


export default router;
