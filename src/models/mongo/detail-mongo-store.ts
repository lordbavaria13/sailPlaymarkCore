
import { Detail } from "./detail.js";

interface DetailsProps {
    pmId: string;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
    _id?: string;
}

export const detailMongoStore = {
  async getAllDetails() {
    const details = await Detail.find().select("-__v").lean();
    return details;
  },

  async getDetailsById(id: string): Promise<DetailsProps | null> {
    if (id) {
      const detail = await Detail.findOne({ _id: id }).select("-__v").lean();
      return detail as DetailsProps;
    }
    return null;
  },

  async addDetails(details: DetailsProps): Promise<DetailsProps | null> {
    const { v4 } = await import("uuid");
    if (!details._id) details._id = v4();
    const newDetails = new Detail(details);
    const detailsObj = await newDetails.save();
    return this.getDetailsById(detailsObj._id!);
  },

  async getDetailByPmId(id: string) {
    const detail = await Detail.findOne({
      $or: [{ pmId: id }, { placemarkid: id }, { pmid: id }],
    }).lean();
    return detail;
  },

  async deleteDetailsById(id: string) {
    try {
      await Detail.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id", error);
    }
  },

  async deleteAllDetails() {
    await Detail.deleteMany({});
  },

  async updateDetailsById(id: string, updated: Partial<DetailsProps>): Promise<DetailsProps | null> {
    if (id) {
      const detail = await Detail.findOneAndUpdate({ _id: id }, updated, { new: true }).select("-__v").lean();
      return detail as DetailsProps;
    }
    return null;
  }
};