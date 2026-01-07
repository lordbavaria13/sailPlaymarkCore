import { v4 } from "uuid";
import { db } from "./store-utils.js";

export interface PlacemarkProps {
  title: string;
  userId: string;
  categories?: string[];
  images?: string[];
  _id?: string;
}

export const placemarkJsonStore = {
  async getAllPlacemarks(): Promise<PlacemarkProps[]> {
    await db.read();
    return (db.data!.placemarks as PlacemarkProps[]);
  },

  async addPlacemarks(placemark: PlacemarkProps): Promise<PlacemarkProps> {
    await db.read();
    // ensure defaults for new optional fields
    if (!placemark.categories) placemark.categories = [];
    if (!placemark.images) placemark.images = [];
    placemark._id = v4();
    db.data!.placemarks.push(placemark);
    await db.write();
    return placemark;
  },

  async deletePlacemarkById(id: string): Promise<void> {
    await db.read();
    db.data!.placemarks = db.data!.placemarks.filter((p) => p._id !== id);
    await db.write();
  },

  async getPlacemarkById(id: string): Promise<PlacemarkProps | null> {
    await db.read();
    const found = (db.data!.placemarks as PlacemarkProps[]).find((p) => p._id === id);
    return found ?? null;
  },

  async getUserPlacemarks(userId: string): Promise<PlacemarkProps[]> {
    await db.read();
    return (db.data!.placemarks as PlacemarkProps[]).filter((p) => p.userId === userId);
  },

  async updatePlacemarkById(id: string, updatedPlacemark: Partial<PlacemarkProps>): Promise<PlacemarkProps | null> {
    await db.read();
    const placemarkIndex = (db.data!.placemarks as PlacemarkProps[]).findIndex((placemark) => placemark._id === id);
    if (placemarkIndex === -1) {
      return null; // Placemark not found
    }
    const placemark = (db.data!.placemarks as PlacemarkProps[])[placemarkIndex];
    // preserve existing arrays if not provided in update
    const merged: PlacemarkProps = {
      ...placemark,
      ...updatedPlacemark,
      categories: updatedPlacemark.categories ?? placemark.categories ?? [],
      images: updatedPlacemark.images ?? placemark.images ?? [],
    };
    (db.data!.placemarks as PlacemarkProps[])[placemarkIndex] = merged;
    await db.write();
    return merged;
  },

  async deleteAllPlacemarks(): Promise<void> {
    await db.read();
    db.data!.placemarks = [];
    await db.write();
  },  
};