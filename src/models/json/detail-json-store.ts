import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { get } from "http";

export interface DetailsProps {
    pmId: string;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
    _id?: string;
}   

export const detailJsonStore = {
  async getAllDetails() {
    await db.read();
    return db.data.details;
  },

  async addDetails(details: DetailsProps): Promise<DetailsProps> {
    await db.read();
    details._id = v4();
    db.data.details.push(details);
    await db.write();
    return details;
  },

  async deleteDetailsById(id: string): Promise<void> {
    await db.read();
    db.data.details = db.data.details.filter((details) => details._id !== id);
    await db.write();
  },  

  async getDetailByPmId(pmId: string): Promise<DetailsProps | null> {
    await db.read();
    const detail = db.data.details.find((details) => details.pmId === pmId);
    return detail ?? null;
  },
  async deleteAllDetails(): Promise<void> {
    db.data.details = [];
    await db.write();
  },

  async updateDetailsById(id: string, updatedDetails: Partial<DetailsProps>): Promise<DetailsProps | null> {
    await db.read();
    const detailsIndex = db.data.details.findIndex((details) => details._id === id);
    if (detailsIndex === -1) {
      return null; // Details not found
    }
    const details = db.data.details[detailsIndex];
    const updatedDetailsObj = { ...details, ...updatedDetails };
    db.data.details[detailsIndex] = updatedDetailsObj;
    await db.write();
    return updatedDetailsObj;
  },
}