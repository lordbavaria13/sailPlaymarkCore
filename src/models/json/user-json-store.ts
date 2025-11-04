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
    return (db.data!.users as UserProps[]);
  },

  async addUser(user: UserProps) {
    await db.read();
    user._id = v4();
    db.data!.placemarks.push(user);
    await db.write();
    return user;
  },

  async getUserByEmail(email: string): Promise<UserProps | undefined> {
    const users = await this.getAllUsers();
    return users.find((user) => user.email === email);
  },
};