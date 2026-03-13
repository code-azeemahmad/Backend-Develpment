import mongoose from 'mongoose';
import { Hospital } from './hospital.models';

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    diagnosedWith: {
      type: String,
      required: true,
    },
    address: {
      type: string,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'CUSTOM'],
      required: true,
    },
    admittedIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
  },
  { timestamps: true }
);

export const Patient = mongoose.model('Patient', patientSchema);
