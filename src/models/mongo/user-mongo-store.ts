import { User } from "./user.js";

export interface UserProps {
  username: string;
  password: string;
  email: string;
  isAdmin?: boolean;
  _id?: string;
}

export type UserLean = UserProps & { _id: string };

export const userMongoStore = {
  async getAllUsers(): Promise<UserLean[]> {
    return User.find().select("-__v").lean<UserLean[]>();
  },

  async getUserById(id: string): Promise<UserLean | null> {
    return User.findOne({ _id: id }).select("-__v").lean<UserLean | null>();
  },



  async addUser(user: UserProps): Promise<UserLean> {
    const { v4 } = await import("uuid");
    if (!user._id) user._id = v4();

    await new User(user).save();
    return user as UserLean;
  },

  async getUserByEmail(email: string): Promise<UserLean | null> {
    if (!email) return null;
    const user = await User.findOne({ email }).select("-__v").lean<UserLean | null>();
    return user ?? null;
  },

    async getUserByUsername(username: string): Promise<UserLean | null> {
    if (!username) return null;
    const user = await User.findOne({ username }).select("-__v").lean<UserLean | null>();
    return user ?? null;
  },

  async deleteUserById(id: string): Promise<void> {
    await User.deleteOne({ _id: id });
  },

  async deleteAllUsers(): Promise<void> {
    await User.deleteMany({});
  },
};
