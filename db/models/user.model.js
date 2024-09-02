import { model, Schema } from "mongoose";
import { systemRoles } from "../../src/utils/system.roles.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: 3,
      maxlength: 15,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      // select: false, // Do not return password in query results
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    phone: [String],
    address: [String],
    confirmed: {
      default: false,
      type: Boolean,
    },
    loggedIn: {
      default: false,
      type: Boolean,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: "user",
    },
    otpCode: String,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const userModel = model("user", userSchema);
