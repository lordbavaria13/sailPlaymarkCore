import { v4 } from 'uuid';
import { db } from './store-utils.js';

export interface PlacemarkProps {
  title: string;
  _id?: string;
}

export const placemarkJsonStore = {
  async getAllPlacemarks(): Promise<PlacemarkProps[]> {
    await db.read();
    return (db.data!.placemarks as PlacemarkProps[]);
  },

  async addPlacemarks(placemark: PlacemarkProps): Promise<PlacemarkProps> {
    await db.read();
    placemark._id = v4();
    db.data!.placemarks.push(placemark);
    await db.write();
    return placemark;
  },

  async deletePlacemarkById(id: string): Promise<void> {
    await db.read();
    db.data!.placemarks = db.data!.placemarks.filter((placemark) => placemark._id !== id);
    await db.write();
  },

  async getPlacemarkById(id: string): Promise<PlacemarkProps | null> {
    await db.read();
    const placemark = (db.data!.placemarks as PlacemarkProps[]).find((placemark) => placemark._id === id);
    return placemark ?? null;
  },

  async updatePlacemarkById(id: string, updatedPlacemark: Partial<PlacemarkProps>): Promise<PlacemarkProps | null> {
    await db.read();
    const placemarkIndex = (db.data!.placemarks as PlacemarkProps[]).findIndex((placemark) => placemark._id === id);
    if (placemarkIndex === -1) {
      return null; // Placemark not found
    } 
    const placemark = (db.data!.placemarks as PlacemarkProps[])[placemarkIndex];
    const updatedPlacemarkObj = { ...placemark, ...updatedPlacemark };
    (db.data!.placemarks as PlacemarkProps[])[placemarkIndex] = updatedPlacemarkObj;
    await db.write();
    return updatedPlacemarkObj;
  }
};