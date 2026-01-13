
import { Request, ResponseToolkit } from "@hapi/hapi";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
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
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
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
      if (!user) {
        return h.redirect("/");
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return h.redirect("/");
      }
      const { cookieAuth } = request;
      cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },

  loginGithub: {
    auth: "github",
    handler: async function (request: Request, h: ResponseToolkit) {
      if (!request.auth.isAuthenticated) {
        return h.view("login-view", { title: "Login Error", errors: "Authentication failed" });
      }
      if (!db.userStore) {
        return h.redirect("/");
      }

      const credentials = request.auth.credentials as any;
      const profile = credentials?.profile;
      const email = profile?.email;
      const username = profile?.username || profile?.displayName || email.split("@")[0];

      let user = await db.userStore.getUserByEmail(email);

      if (!user) {
        user = {
          username: username,
          email: email,
          password: v4(),
        };
        await db.userStore.addUser(user);
      }

      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },

  loginGoogle: {
    auth: "google",
    handler: async function (request: Request, h: ResponseToolkit) {
      if (!request.auth.isAuthenticated) {
        return h.view("login-view", { title: "Login Error", errors: "Authentication failed" });
      }
      if (!db.userStore) {
        return h.redirect("/");
      }

      const credentials = request.auth.credentials as any;
      const profile = credentials?.profile;
      const email = profile?.email;
      const username = profile?.displayName || email.split("@")[0];

      let user = await db.userStore.getUserByEmail(email);

      if (!user) {
        user = {
          username: username,
          email: email,
          password: v4(),
        };
        await db.userStore.addUser(user);
      }

      request.cookieAuth.set({ id: user._id });
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

