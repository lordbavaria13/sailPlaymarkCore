
import { Request, ResponseToolkit } from '@hapi/hapi';

import { db } from "../models/db.js";
import { UserProps } from '../models/json/user-json-store.js';

export const accountsController = {
  index: {
    auth: false as const,
    handler: function (request:Request, h:ResponseToolkit) {
      return h.view("main", { title: "Welcome to Sailing Placemarks" });
    },
  },
  showSignup: {
    auth: false as const,
    handler: function (request:Request, h:ResponseToolkit) {
      return h.view("signup-view", { title: "Sign up for Sailing Placemarks" });
    },
  },
  signup: {
    auth: false as const,
    handler: async function (request:Request, h:ResponseToolkit) {
      const user:UserProps = request.payload as UserProps;
      if (!db.userStore) {
        return h.redirect("/");
      }
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false as const,
    handler: function (request:Request, h:ResponseToolkit) {
      return h.view("login-view", { title: "Login to Sailing Placemarks" });
    },
  },
  login: {
    auth: false as const,
    handler: async function (request:Request, h:ResponseToolkit) {
      const { username, password} = request.payload as UserProps;
      if (!db.userStore) {
        return h.redirect("/");
      }
      const user = await db.userStore.getUserByUsername(username);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      // create session
      (request as any).cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    auth: false as const,
    handler: function (request: Request, h: ResponseToolkit) {
      (request as any).cookieAuth.clear();
      return h.redirect("/");
    },
  },

  async validate(request: Request, session: { id?: string }) {
    
    if (!session || !session.id) {
      return { isValid: false };
    }
    const user = await db.userStore!.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },

};

