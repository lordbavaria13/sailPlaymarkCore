import { v4 } from "uuid";
import { db } from "./store-utils.js";

export interface DetailsProps {
    pmId: string;
    latitude: number;
    longitude: number;
    titel: string;
    description: string;
    _id?: string;
}   

export const trackJsonStore = {
  async getAllTracks() {
    await db.read();
    return db.data.details;
  },
}