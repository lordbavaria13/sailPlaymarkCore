import { v4 } from "uuid";
import { db } from "./store-utils.js";

export interface UserProps {
  username: string;
  password: string,
  email: string;
  _id?: string;
}

export const usersJsonStore = {
  async getAllUsers(): Promise<UserProps[]> {
    await db.read();
    return db.data.users;
  },

  async addUser(user: UserProps) {
    await db.read();
    user._id = v4();
    db.data.users.push(user);
    await db.write();
    return user;
  },

  async getUserByEmail(email: string): Promise<UserProps | null | undefined> {
    if (!email) return null;
    await db.read();
    const users = await this.getAllUsers();
    return users.find((user) => user.email === email) ?? null;
  },

  async getUserByUsername(username: string): Promise<UserProps | null | undefined> {
    await db.read();
    return db.data.users.find((user) => user.username === username) ?? null;
  },

  async getUserById(id: string): Promise<UserProps | null | undefined> {
    if (!id) return null;
    await db.read();
    return db.data.users.find((user) => user._id === id) ?? null;
  },

  async deleteUserById(id: string): Promise<void> {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    if (index !== -1) db.data.users.splice(index, 1);
    await db.write();
  },


  async deleteAllUsers(): Promise<void> {
    await db.read();
    db.data.users = [];
    await db.write();
  },
};