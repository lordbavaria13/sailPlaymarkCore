import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
  title: String,
  userId: String,
  categories: [String],
  images: [String],
  _id: String,
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);
