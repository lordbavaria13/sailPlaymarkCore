import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";

type Data = {
  users: unknown[];
  placemarks: unknown[];
  details: unknown[];
};

const file = join(process.cwd(), "src", "models", "json", "db.json");
const adapter = new JSONFile<Data>(file);

// Exportiere die Low-Instanz (kein Promise/factory)
export const db = new Low<Data>(adapter, { users: [], placemarks: [], details: [] });

export async function initDb() {
  await db.read();
  db.data ||= { users: [], placemarks: [], details: [] };
  await db.write();
}

