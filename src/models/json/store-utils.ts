


import { JSONFilePreset } from "lowdb/node";
import { UserProps } from "./user-json-store.js";
import { PlacemarkProps } from "./placemark-json-store.js";
import { DetailsProps } from "./detail-json-store.js";

export const db = await JSONFilePreset("src/models/json/db.json", {
  users: [] as UserProps[],
  placemarks:  [] as PlacemarkProps[],
  details: [] as DetailsProps[],
});
