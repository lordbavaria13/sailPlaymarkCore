import Mongoose from "mongoose";

const { Schema } = Mongoose;

const commentSchema = new Schema({
  placemarkId: String,
  userId: String,
  username: String,
  text: String,
  rating: Number,
  date: Date,
  _id: String,
});

export const Comment = Mongoose.model("Comment", commentSchema);
