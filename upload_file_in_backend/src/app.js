import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, 
}))

app.use(express.json({limit: "16kb"}));     // reads the request body and parses JSON
app.use(express.urlencoded({extended: true, limit: "16kb"}));       // Parses data sent from HTML FORMS
app.use(express.static("public"));      // Serves STATIC FILES directly from the "public" folder
app.use(cookieParser());        // Parses cookies sent by the browser in request headers

export {app};

// npm i cors cookie-parser
// app.use() method is used for all config, middlewares
// options are present at production level in cors()
// apply some settings before cookie options



// CORS — What it Does and Where
/*
Problem it solves:

Browser has a SECURITY rule:
"You cannot talk to a different origin"

Your React  → http://localhost:5173   (origin A)
Your Express → http://localhost:8000  (origin B)

Different ports = Different origins
Browser BLOCKS the request by default


CORS tells Express:
"Trust requests coming from localhost:5173"
Browser sees the permission → allows the request
*/