import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";

import { db } from "../models/db.js";

type Credentials = { _id?: string; isAdmin?: boolean };

function requireAdmin(request: Request) {
  const creds = request.auth.credentials as Credentials;
  if (!creds?.isAdmin) {
    return false;
  }
  return true;
}

export const adminController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit) {
      if (!requireAdmin(request)) {
        return h.redirect("/dashboard");
      }
      const users = await db.userStore!.getAllUsers();
      return h.view("admin-view", {
        title: "Admin Panel",
        active: "admin",
        users,
        user: request.auth.credentials,
      });
    },
  },

  deleteUser: {
    handler: async function (request: Request, h: ResponseToolkit) {
      if (!requireAdmin(request)) {
        return h.redirect("/dashboard");
      }

      const targetUserId = request.params.id as string;
      const creds = request.auth.credentials as Credentials;

      // Prevent deleting yourself (basic safety).
      if (creds?._id && targetUserId === creds._id) {
        return h.redirect("/admin");
      }

      try {
        await db.userStore!.deleteUserById(targetUserId);

        const placemarks = await db.placemarkStore!.getUserPlacemarks(targetUserId);
        await Promise.all(
          placemarks.map(async (placemark) => {
            const detail = await db.detailStore!.getDetailByPmId(placemark._id!);
            if (detail?._id) {
              await db.detailStore!.deleteDetailsById(detail._id);
            }
            await db.placemarkStore!.deletePlacemarkById(placemark._id!);
          })
        );

        return h.redirect("/admin");
      } catch (err) {
        return Boom.serverUnavailable(`Database Error ${err}`);
      }
    },
  },
};
