import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { UserProps } from "../models/mongo/user-mongo-store.js";

export const userApi = {
  create: {
    auth: false,
    handler: async function(request: Request, h: ResponseToolkit) {
      try {
        const user = await db.userStore!.addUser(request.payload as UserProps);
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable(`Database Error ${err}`);
      }
    },
  },

    findOne: {
    auth: false,
    handler: async function (request: Request, _h: ResponseToolkit) {
      try {
        const user = await db.userStore!.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable(`No User with this id ${err}`);
      }
    },
  },

  find: {
    auth: false,
    handler: async function(_request: Request, _h: ResponseToolkit) {
      try {
        const users = await db.userStore!.getAllUsers();
        return users;
      } catch (err) {
        return Boom.serverUnavailable(`Database Error ${err}`);
      }
    },
  },

    deleteAll: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        await db.userStore!.deleteAllUsers();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable(`Database Error ${err}`);
      }
    },
  },
};
