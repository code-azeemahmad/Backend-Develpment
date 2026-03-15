import asyncHandler from "../utils/asyncHandler.js";

// more controllers, more logic building
const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "code-azeemahmad",
    });
})

export {registerUser};

// import userController and userRoute in app.js (industry standard)