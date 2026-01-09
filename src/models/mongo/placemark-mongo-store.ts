
import { Placemark } from "./placemark.js";

interface PlacemarkProps {
  title: string;
  userId: string;
  category?: string;
  images?: string[];
  _id?: string;
}

export const placemarkMongoStore = {
  async getAllPlacemarks() {
    const placemarks = await Placemark.find().select("-__v").lean();
    return placemarks;
  },

  async getPlacemarkById(id: string) {
    if (id) {
      const placemark = await Placemark.findOne({ _id: id }).select("-__v").lean();
      
      return placemark;
    }
    return null;
  },

  async addPlacemarks(placemark: PlacemarkProps) {
    const { v4 } = await import("uuid");
    if (!placemark._id) placemark._id = v4();
    const newPlacemark = new Placemark(placemark);
    const placemarkObj = await newPlacemark.save();
    return this.getPlacemarkById(placemarkObj._id!);
  },

  async getUserPlacemarks(id: string) {
    const placemarks = await Placemark.find({ userId: id }).select("-__v").lean();
    return placemarks;
  },

  async deletePlacemarkById(id: string) {
            try {
      await Placemark.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id", error);
    }
  },

  async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  },

  async updatePlacemarkById(id: string, updatedPlacemark: Partial<PlacemarkProps>) {
    const placemark = await Placemark.findOneAndUpdate({ _id: id }, updatedPlacemark, { new: true }).select("-__v").lean();
    return placemark;
  }
};
