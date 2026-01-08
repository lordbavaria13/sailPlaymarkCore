import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { UserProps } from "../models/mongo/user-mongo-store.js";
import { UserArray, UserSpec } from "../models/joi-schemas.js";
import { validationError } from "../models/logger.js";

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
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    validate: { payload: UserSpec, failAction: validationError },
    response: { schema: UserSpec, failAction: validationError },
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
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
    response: { schema: UserSpec, failAction: validationError },
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
    tags: ["api"],
    description: "Get all userApi",
    notes: "Returns details of all userApi",
    response: { schema: UserArray, failAction: validationError },
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
    tags: ["api"],
    description: "Delete all userApi",
    notes: "All userApi removed from Playtime",
  },
};
