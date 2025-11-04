
import { Request, ResponseToolkit } from '@hapi/hapi';

import { db } from "../models/db.js";
import { UserProps } from '../models/json/user-json-store.js';

export const accountsController = {
  index: {
    handler: function (request:Request, h:ResponseToolkit) {
      return h.view("main", { title: "Welcome to Sailing Placemarks" });
    },
  },
  showSignup: {
    handler: function (request:Request, h:ResponseToolkit) {
      return h.view("signup-view", { title: "Sign up for Sailing Placemarks" });
    },
  },
  signup: {
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
    handler: function (request:Request, h:ResponseToolkit) {
      return h.view("login-view", { title: "Login to Sailing Placemarks" });
    },
  },
  login: {
    handler: async function (request:Request, h:ResponseToolkit) {
      const { username, password, email } = request.payload as UserProps;
      if (!db.userStore) {
        return h.redirect("/");
      }
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      return h.redirect("/dashboard");
    },
  },
  logout: {
    handler: function (request: Request, h: ResponseToolkit) {
      return h.redirect("/");
    },
  },
};

