import axios from "axios";

import { serviceUrl } from "../fixtures.js";
import { UserProps } from "../../models/json/user-json-store.js";
import { PlacemarkProps } from "../../models/json/placemark-json-store.js";
import { DetailsProps } from "../../models/json/detail-json-store.js";

export const placemarkService = {
  placemarkUrl: serviceUrl,

  async createUser(user: UserProps): Promise<UserProps> {
    const res = await axios.post(`${this.placemarkUrl}/api/users`, user);
    return res.data;
  },

    async getUser(id: string): Promise<UserProps> {
    const res = await axios.get(`${this.placemarkUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers(): Promise<UserProps[]> {
    const res = await axios.get(`${this.placemarkUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers(): Promise<any> {
    const res = await axios.delete(`${this.placemarkUrl}/api/users`);
    return res.data;
  },

  async createPlacemark(placemark: PlacemarkProps): Promise<PlacemarkProps> {
    const res = await axios.post(`${this.placemarkUrl}/api/placemarks`, placemark);
    return res.data;
  },

  async deleteAllPlacemarks() {
    const response = await axios.delete(`${this.placemarkUrl}/api/placemarks`);
    return response.data;
  },

  async deletePlacemark(id: string) {
    const response = await axios.delete(`${this.placemarkUrl}/api/placemarks/${id}`);
    return response;
  },

  async getAllPlacemarks() {
    const res = await axios.get(`${this.placemarkUrl}/api/placemarks`);
    return res.data;
  },

  async getPlacemark(id: string) {
    const res = await axios.get(`${this.placemarkUrl}/api/placemarks/${id}`);
    return res.data;
  },

  async createDetail(details: DetailsProps): Promise<DetailsProps> {
    const res = await axios.post(`${this.placemarkUrl}/api/details`, details);
    return res.data;
  },

  async deleteAllDetails() {
    const res = await axios.delete(`${this.placemarkUrl}/api/details`);
    return res.data;
  },

  async deleteDetail(id: string) {
    const res = await axios.delete(`${this.placemarkUrl}/api/details/${id}`);
    return res;
  },

  async getAllDetails(): Promise<DetailsProps[]> {
    const res = await axios.get(`${this.placemarkUrl}/api/details`);
    return res.data;
  },

  async getDetail(id: string): Promise<DetailsProps> {
    const res = await axios.get(`${this.placemarkUrl}/api/details/${id}`);
    return res.data;
  },
  async authenticate(user: UserProps) {
    const response = await axios.post(`${this.placemarkUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
    return response.data;
  },

  async clearAuth() {
    axios.defaults.headers.common.Authorization = "";
  }
}
