import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";

interface PlacemarkProps {
  title: string;
  userId: string;
  categories?: string[];
  images?: string[];
  _id?: string;
}

export const placemarkApi = {
  find: {
    auth: false,
    handler: async function (_request: Request, _h: ResponseToolkit) {
      try {
        const placemarks = await db.placemarkStore!.getAllPlacemarks();
        return placemarks;
      } catch (err) {
        return Boom.serverUnavailable(`Database Error ${err}`);
      }
    },
  },

  findOne: {
    auth: false,
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
  },

  create: {
    auth: false,
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
  },

  deleteOne: {
    auth: false,
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
  },

  deleteAll: {
    auth: false,
    handler: async function (_request: Request, h: ResponseToolkit) {
      try {
        await db.placemarkStore!.deleteAllPlacemarks();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable(`Database Error ${err}`);
      }
    },
  },
};
