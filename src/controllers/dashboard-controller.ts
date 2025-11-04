import { Request, ResponseToolkit } from '@hapi/hapi';

import { db } from "../models/db.js";
import { PlacemarkProps } from '../models/json/placemark-json-store.js';

export const dashboardController = {
    index: {
        handler: async function (request: Request, h: ResponseToolkit) {
            if (!db.placemarkStore) {
                throw new Error("placemarkStore not initialized");
            }
            const placemarks = await db.placemarkStore.getAllPlacemarks();
            const viewData = {
                title: "Sailing Dashboard",
                playlists: placemarks,
            };
            return h.view("dashboard-view", viewData);
        },
    },

    addPlacemark: {
        handler: async function (request: Request, h: ResponseToolkit) {
            const payload = request.payload as { title?: string };
            const newPlacemark: PlacemarkProps = { title: payload.title ?? "" };
            await db.placemarkStore!.addPlacemarks(newPlacemark);
            return h.redirect("/dashboard");
        },
    },
};
