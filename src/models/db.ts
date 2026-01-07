
import { placemarkJsonStore } from "./json/placemark-json-store.js";
import { usersJsonStore } from "./json/user-json-store.js";
import { detailJsonStore } from "./json/detail-json-store.js";  

import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";
import { detailMongoStore } from "./mongo/detail-mongo-store.js";

type PlacemarkJsonStoreType = typeof placemarkJsonStore;
type UserJsonStoreType = typeof usersJsonStore;
type DetailJsonStoreType = typeof detailJsonStore;

type UserMongoStoreType = typeof userMongoStore;
type PlacemarkMongoStoreType = typeof placemarkMongoStore;
type DetailMongoStoreType = typeof detailMongoStore;

export const db = {
  placemarkStore: null as PlacemarkJsonStoreType | PlacemarkMongoStoreType | null,
  userStore: null as UserJsonStoreType | UserMongoStoreType | null,
  detailStore: null as DetailJsonStoreType | DetailMongoStoreType | null,

  async init(storeType: "json" | "mongo") {
    switch (storeType) {
      case "mongo":
        this.userStore = userMongoStore;
        this.placemarkStore = placemarkMongoStore;
        this.detailStore = detailMongoStore;
        await connectMongo();
        break;
      case "json":{
        this.placemarkStore = placemarkJsonStore;
    this.userStore = usersJsonStore;
    this.detailStore = detailJsonStore;
    break;
  }
      default:
        {
        this.placemarkStore = placemarkJsonStore;
    this.userStore = usersJsonStore;
    this.detailStore = detailJsonStore;
    break;
  }
    }
    
  },
};
