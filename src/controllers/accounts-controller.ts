
import { Request, ResponseToolkit } from "@hapi/hapi";

import { db } from "../models/db.js";
import { UserProps } from "../models/json/user-json-store.js";
import { UserCredentialsSpec, UserSpec } from "../models/joi-schemas.js";


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
     validate: {
      payload: UserSpec,
      failAction: function (request:Request, h:ResponseToolkit, error?:Error) {
        if(error) {
          console.log("Validation error:", error.message);
        }
        return h.view("signup-view", { title: "Error, please try again", errors: error?.message }).takeover().code(400);
      }
    },
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
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request:Request, h:ResponseToolkit, error?:Error) {
        return h.view("login-view", { title: "Log in error", errors: error?.message }).takeover().code(400);
      },
    },
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
      const { cookieAuth } = request;
      cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    auth: false as const,
    handler: function (request: Request, h: ResponseToolkit) {
      const { cookieAuth } = request;
      cookieAuth.clear();
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

