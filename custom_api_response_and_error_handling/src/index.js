// require('dotenv').config({path: './env'})
import "dotenv/config";

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import connectDB from "./db/index.js";

const app = express();

const PORT = process.env.PORT;

console.log("Hello backend");

connectDB()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection failed:", err);
  });

// problems arise yapping to db, wrap in try-catch or promises
// db is always in an another continent, use of async await