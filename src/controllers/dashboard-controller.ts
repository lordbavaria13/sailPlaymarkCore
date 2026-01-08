import { Request, ResponseToolkit } from "@hapi/hapi";

import { v4 } from "uuid";
import { db } from "../models/db.js";
import { DetailsProps } from "../models/json/detail-json-store.js";
import { DetailsSpec, PlacemarkSpec } from "../models/joi-schemas.js";

export const dashboardController = {
    index: {
        handler: async function (request: Request, h: ResponseToolkit) {
            if (!db.placemarkStore) {
                throw new Error("placemarkStore not initialized");
            }
            const loggedInUser = request.auth.credentials as { _id?: string };
            if (!loggedInUser || !loggedInUser._id) {
                throw new Error("User not authenticated");
            }
            const placemarks = await db.placemarkStore!.getUserPlacemarks(loggedInUser._id);
            const viewData = {
                title: "Sailing Dashboard",
                placemarks: placemarks,
                user: loggedInUser,  
            };
            return h.view("dashboard-view", viewData);
        },
    },

    addPlacemark: {
        validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },
            failAction: function (request:Request, h:ResponseToolkit, error?:Error) {
                return h.view("dashboard-view", { title: "Add Placemark error", errors: error?.message }).takeover().code(400);
            },
    },
        handler: async function (request: Request, h: ResponseToolkit) {
            const payload = request.payload as { title?: string };
            const loggedInUser = request.auth.credentials as { _id?: string };
            if (!loggedInUser || !loggedInUser._id) {
                throw new Error("User not authenticated");
            }
            const newPlacemark = await db.placemarkStore!.addPlacemarks({ title: payload.title ?? "", userId: loggedInUser._id! });
            if (!newPlacemark) {
                return h.view("dashboard-view", { title: "Add Placemark error", errors: "Failed to create placemark." }).takeover().code(400);
            }
            await db.detailStore!.addDetails({
                pmId: newPlacemark._id!,
                latitude: 0,
                longitude: 0,
                description: "",
                _id: v4(),
                title: newPlacemark.title!
            });
            return h.redirect("/dashboard");
        },
    },

    deletePlacemark: {
        handler: async function( request: Request, h: ResponseToolkit) {
            const placemarkId = request.params.id;
            await db.placemarkStore!.deletePlacemarkById(placemarkId);
            return h.redirect("/dashboard");
        }
    },

    showPlacemarkDetails: {
        handler: async function(request: Request, h: ResponseToolkit) {
            const placemarkId = request.params.id;
            const placemark = await db.placemarkStore!.getPlacemarkById(placemarkId);   
            console.log("Placemark ID:", placemarkId);
            const details = await db.detailStore!.getDetailByPmId(placemarkId);
            console.log("Details:", details);
            return h.view("placemark-detail-view", { details: details, placemark: placemark } );
        }
    },

        showEditPlacemarkDetails: {
        handler: async function(request: Request, h: ResponseToolkit) {
            const detailsId = request.params.id;
            const details = await db.detailStore!.getDetailsById(detailsId);
            if (!details) {
                return h.view("edit-placemark-view", { details: null });
            }
            const placemark = await db.placemarkStore!.getPlacemarkById(details.pmId);
            const categoriesCSV = placemark?.categories ? placemark.categories.join(", ") : "";
            const imagesCSV = placemark?.images ? placemark.images.join(", ") : "";
            return h.view("edit-placemark-view", { details: details, placemark: placemark, categoriesCSV, imagesCSV });
        }
    },
    updatePlacemarkDetails: {
    validate: {
      payload: DetailsSpec,
      options: { abortEarly: false },
            failAction: function (request:Request, h:ResponseToolkit, error?:Error) {
                return h.view("dashboard-view", { title: "Add track error", errors: error?.message }).takeover().code(400);
            },
    },
        handler: async function(request: Request, h: ResponseToolkit) {
            const placemarkId = request.params.id;
            const detailsId = await db.detailStore!.getDetailByPmId(placemarkId).then(detail => detail?._id) ?? "";
            const payload = request.payload as DetailsProps & { categories?: string; images?: string };
            const updatedDetails: DetailsProps | null = {
                pmId: placemarkId,
                latitude: Number(payload.latitude),
                longitude: Number(payload.longitude),
                title: payload.title,
                description: payload.description,
            };
            // parse CSV fields into arrays for placemark
            const categories = payload.categories ? payload.categories.split(",").map((s) => s.trim()).filter(Boolean) : [];
            const images = payload.images ? payload.images.split(",").map((s) => s.trim()).filter(Boolean) : [];

            console.log("Updated Details:", updatedDetails);
            await db.detailStore!.updateDetailsById(detailsId, updatedDetails!);
            
            await db.placemarkStore!.updatePlacemarkById(placemarkId, { title: updatedDetails!.title, categories, images });
            return h.redirect(`/dashboard/placemark/${  placemarkId}`);
        }
    }
};
