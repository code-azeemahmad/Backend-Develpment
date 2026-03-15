import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router = Router();

router.route("/register").post(registerUser);
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