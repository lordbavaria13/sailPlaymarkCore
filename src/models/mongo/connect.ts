import * as dotenv from "dotenv";
import Mongoose from "mongoose";

export async function connectMongo(): Promise<void> {
  dotenv.config();

  const uri = process.env.DB || process.env.db;
  if (!uri) {
    throw new Error("connectMongo: missing DB connection string in env var `DB` or `db`");
  }

  if (Mongoose.connection.readyState === 1) {
    return;
  }

  Mongoose.set("strictQuery", true);
  await Mongoose.connect(uri);
  const db = Mongoose.connection;

  db.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  db.on("disconnected", () => {
    console.log("database disconnected");
  });

  db.once("open", function (this: typeof db) {
    console.log(`database connected to ${this.name} on ${this.host}`);
  });
} 
