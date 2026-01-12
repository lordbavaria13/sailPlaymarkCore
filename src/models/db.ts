
import { placemarkJsonStore } from "./json/placemark-json-store.js";
import { usersJsonStore } from "./json/user-json-store.js";
import { detailJsonStore } from "./json/detail-json-store.js";  
import { commentJsonStore } from "./json/comment-json-store.js";

import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";
import { detailMongoStore } from "./mongo/detail-mongo-store.js";
import { commentMongoStore } from "./mongo/comment-mongo-store.js";

type PlacemarkJsonStoreType = typeof placemarkJsonStore;
type UserJsonStoreType = typeof usersJsonStore;
type DetailJsonStoreType = typeof detailJsonStore;
type CommentJsonStoreType = typeof commentJsonStore;

type UserMongoStoreType = typeof userMongoStore;
type PlacemarkMongoStoreType = typeof placemarkMongoStore;
type DetailMongoStoreType = typeof detailMongoStore;
type CommentMongoStoreType = typeof commentMongoStore;

export const db = {
  placemarkStore: null as PlacemarkJsonStoreType | PlacemarkMongoStoreType | null,
  userStore: null as UserJsonStoreType | UserMongoStoreType | null,
  detailStore: null as DetailJsonStoreType | DetailMongoStoreType | null,
  commentStore: null as CommentJsonStoreType | CommentMongoStoreType | null,

  async init(storeType: "json" | "mongo") {
    switch (storeType) {
      case "mongo":
        this.userStore = userMongoStore;
        this.placemarkStore = placemarkMongoStore;
        this.detailStore = detailMongoStore;
        this.commentStore = commentMongoStore;
        await connectMongo();
        break;
      case "json":{
        this.placemarkStore = placemarkJsonStore;
    this.userStore = usersJsonStore;
    this.detailStore = detailJsonStore;
    this.commentStore = commentJsonStore;
    break;
  }
      default:
        {
        this.placemarkStore = placemarkJsonStore;
    this.userStore = usersJsonStore;
    this.detailStore = detailJsonStore;
    this.commentStore = commentJsonStore;
    break;
  }
    }
    
  },
};
