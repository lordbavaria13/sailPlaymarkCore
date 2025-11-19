
import { placemarkJsonStore } from "./json/placemark-json-store.js";
import { usersJsonStore } from "./json/user-json-store.js";

type PlacemarkJsonStoreType = typeof placemarkJsonStore;
type UserJsonStoreType = typeof usersJsonStore;

export const db = {
  placemarkStore: null as PlacemarkJsonStoreType | null,
  userStore: null as UserJsonStoreType | null,

  async init() {
    this.placemarkStore = placemarkJsonStore;
    this.userStore = usersJsonStore;
  },
};
