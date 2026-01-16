import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { IdSpec, PlacemarkArray, PlacemarkSpec, PlacemarkSpecPlus } from "../models/joi-schemas.js";
import { validationError } from "../models/logger.js";

interface PlacemarkProps {
  title: string;
  userId: string;
  category?: string;
  images?: string[];
  _id?: string;
}

export const placemarkApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (_request: Request, _h: ResponseToolkit) {
      try {
        const placemarks = await db.placemarkStore!.getAllPlacemarks();
        return placemarks;
      } catch (err) {
        return Boom.serverUnavailable(`Database Error ${err}`);
      }
    },
    tags: ["api"],
    description: "Get all placemarks",
    notes: "Returns all placemarks",
    response: { schema: PlacemarkArray, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request: Request, _h: ResponseToolkit) {
      try {
        const placemark = await db.placemarkStore!.getPlacemarkById(request.params.id);
        if (!placemark) {
          return Boom.notFound("No Placemark with this id");
        }
        return placemark;
      } catch (err) {
        return Boom.serverUnavailable("No Placemark with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific placemark",
    notes: "Returns placemark details",
     validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PlacemarkSpec, failAction: validationError },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        const placemark = request.payload;
        const newPlacemark = await db.placemarkStore!.addPlacemarks(placemark as PlacemarkProps);
        if (newPlacemark) {
          return h.response(newPlacemark).code(201);
        }
        return Boom.badImplementation("error creating placemark");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a placemark",
    notes: "Returns the newly created placemark",
    validate: { payload: PlacemarkSpec, failAction: validationError },
    response: { schema: PlacemarkSpecPlus, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        const placemark = await db.placemarkStore!.getPlacemarkById(request.params.id);
        if (!placemark) {
          return Boom.notFound("No Placemark with this id");
        }
        await db.placemarkStore!.deletePlacemarkById(placemark._id!);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Placemark with this id");
      }
    },
    tags: ["api"],
    description: "Delete a placemark",
    notes: "Deletes the placemark with the given id",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (_request: Request, h: ResponseToolkit) {
      try {
        await db.placemarkStore!.deleteAllPlacemarks();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable(`Database Error ${err}`);
      }
    },
    tags: ["api"],
    description: "Delete all placemarks",
    notes: "Removes all placemarks",
  },
};
