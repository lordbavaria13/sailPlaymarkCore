//import { userMemStore } from "./mem/user-json-store";
import { placemarkJsonStore } from "./json/placemark-json-store.js";
import { initDb } from "./json/store-utils.js";
import { usersJsonStore, UserProps } from "./json/user-json-store.js";

type PlacemarkJsonStoreType = typeof placemarkJsonStore; // genauer typisieren wenn gewünscht
type UserJsonStoreType = typeof usersJsonStore; // genauer typisieren wenn gewünscht

export const db = {
  placemarkStore: null as PlacemarkJsonStoreType | null,
  userStore: null as UserJsonStoreType | null,

  async init() {
    // 1) lowdb initialisieren
    await initDb();

    // 2) Stores dynamisch laden (verhindert Zyklen beim Modul‑Load)
    //const { placemarkJsonStore } = await import("./json/placemark-json-store");
    this.placemarkStore = placemarkJsonStore;
    this.userStore = usersJsonStore;
  },
};
