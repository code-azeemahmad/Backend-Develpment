import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import userRouter from './routes/user.routes.js';

// routes decalaration (use app.use(use middleware to bring router from other file) instead of app.get(when controllers and routes in same file))
// app.use('/users', userRouter);
// control goes to user.routes.js
// http://localhost:8000/users/register
// http://localhost:8000/users/login

app.use('/api/v1/users', userRouter);
// // http://localhost:8000/api/v1/users/register

export {app};
