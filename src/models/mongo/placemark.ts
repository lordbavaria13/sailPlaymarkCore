import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
  title: String,
  userId: String,
  category: { type: String, default: "marina" },
  images: [String],
  private: { type: Boolean, default: true },
  _id: String,
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);
