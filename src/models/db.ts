
import { placemarkJsonStore } from "./json/placemark-json-store.js";
import { usersJsonStore } from "./json/user-json-store.js";
import { detailJsonStore } from "./json/detail-json-store.js";  

type PlacemarkJsonStoreType = typeof placemarkJsonStore;
type UserJsonStoreType = typeof usersJsonStore;
type DetailJsonStoreType = typeof detailJsonStore;

export const db = {
  placemarkStore: null as PlacemarkJsonStoreType | null,
  userStore: null as UserJsonStoreType | null,
  detailStore: null as DetailJsonStoreType | null,

  async init() {
    this.placemarkStore = placemarkJsonStore;
    this.userStore = usersJsonStore;
    this.detailStore = detailJsonStore;
  },
};
