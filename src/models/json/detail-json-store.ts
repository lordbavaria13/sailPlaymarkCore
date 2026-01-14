import { v4 } from "uuid";
import { db } from "./store-utils.js";

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
    db.data.details = db.data.details.filter((d) => d._id !== id);
    await db.write();
  }, 
  
  async getDetailsById(id: string): Promise<DetailsProps | null> {  
    await db.read();
    const found = db.data.details.find((d) => d._id === id);
    return found ?? null;
  },

  async getDetailByPmId(pmId: string): Promise<DetailsProps | null> {
    await db.read();
    const found = db.data.details.find((d) => d.pmId === pmId);
    return found ?? null;
  },
  async deleteAllDetails(): Promise<void> {
    db.data.details = [];
    await db.write();
  },

  async updateDetailsById(id: string, updatedDetails: Partial<DetailsProps>): Promise<DetailsProps | null> {
    await db.read();
    const detailsIndex = db.data.details.findIndex((d) => d._id === id);
    if (detailsIndex === -1) {
      return null;
    }
    const details = db.data.details[detailsIndex];
    const merged: DetailsProps = {
         ...details,
         ...updatedDetails,
    } as DetailsProps;
    db.data.details[detailsIndex] = merged;
    await db.write();
    return merged;
  },
}