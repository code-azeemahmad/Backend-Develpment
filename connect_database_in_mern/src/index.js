// require('dotenv').config({path: './env'})
import "dotenv/config";

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import connectDB from "./db/index.js";

const app = express();

console.log("Hello backend");

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start:", error);
  });

// problems arise yapping to db, wrap in try-catch or promises
// db is always in an another continent, use of async await
