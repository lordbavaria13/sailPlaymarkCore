import Mongoose from "mongoose";

const { Schema } = Mongoose;

const detailSchema = new Schema({
  pmId: String,
  latitude: Number,
  longitude: Number,
  title: String,
  description: String,
  _id: String,
});

export const Detail = Mongoose.model("Detail", detailSchema);
