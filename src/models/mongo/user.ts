import Mongoose from "mongoose";

const { Schema } = Mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  _id: String,
});

export const User = Mongoose.model("User", userSchema);
