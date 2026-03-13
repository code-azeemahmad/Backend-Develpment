import mongoose from 'mongoose';

// mongoose helps to create schema
const userSchema = new mongoose.Schema(
  {
    // username: String,
    // email: String,
    // isActive: Boolean,

    // super power of mongoose to enforce validations and custom error messages
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minLength: [8, 'password must be 8 characters long'],
    },
  },
  { timestamps: true }
); // pass secondary object after defining schema acc to doc

// model("what model", on which base)
export const User = mongoose.model('User', userSchema); // model converts into models (plural + lowercase) when stored in database
