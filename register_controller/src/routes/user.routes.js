import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';
import {upload} from "../middlewares/multer.middleware.js";
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

export default router;

/*
 Named Export 
 → can have MANY per file 
 → MUST use exact name 
 → MUST use curly braces 
-------------------------
 Default Export 
 → only ONE per file 
 → can name it anything 
 → NO curly braces 
*/