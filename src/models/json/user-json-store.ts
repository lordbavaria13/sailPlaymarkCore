import { v4 } from 'uuid';
import { db } from './store-utils.js';

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

  async getUserByEmail(email: string): Promise<UserProps | undefined> {
    const users = await this.getAllUsers();
    return users.find((user) => user.email === email);
  },

  async getUserByUsername(username: string): Promise<UserProps | undefined> {
    await db.read();
    return db.data.users.find((user) => user.username === username);
  },

  async getUserById(id: string): Promise<UserProps | undefined> {
    await db.read();
    return db.data.users.find((user) => user._id === id);
  },

  async deleteUserById(id: string): Promise<void> {
    await db.read();
    db.data.users = db.data.users.filter((user) => user._id !== id);
    await db.write();
  },

  async deleteAllUsers(): Promise<void> {
    await db.read();
    db.data.users = [];
    await db.write();
  },
};