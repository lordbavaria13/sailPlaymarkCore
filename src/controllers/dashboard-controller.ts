import { Request, ResponseToolkit } from '@hapi/hapi';

import { db } from "../models/db.js";
import { PlacemarkProps } from '../models/json/placemark-json-store.js';
import { DetailsProps } from '../models/json/detail-json-store.js';
import { v4 } from 'uuid';

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
        handler: async function (request: Request, h: ResponseToolkit) {
            const payload = request.payload as { title?: string };
            const loggedInUser = request.auth.credentials as { _id?: string };
            if (!loggedInUser || !loggedInUser._id) {
                throw new Error("User not authenticated");
            }
            const newPlacemark: PlacemarkProps = await db.placemarkStore!.addPlacemarks({ title: payload.title ?? "", userId: loggedInUser._id! });
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
            //console.log("Details ID:"+ detailsId);
            //const placemark = await db.placemarkStore!.getPlacemarkById(placemarkId); 
            const details = await db.detailStore!.getDetailsById(detailsId);
            //console.log(details);
            return h.view("edit-placemark-view", { details: details });
        }
    },
    updatePlacemarkDetails: {
        handler: async function(request: Request, h: ResponseToolkit) {
            const placemarkId = request.params.id;
            const detailsId = await db.detailStore!.getDetailByPmId(placemarkId).then(detail => detail?._id) ?? "";
            const payload = request.payload as DetailsProps;
            const updatedDetails: DetailsProps | null = {
                pmId: placemarkId,
                latitude: Number(payload.latitude),
                longitude: Number(payload.longitude),
                title: payload.title,
                description: payload.description,
            };
            //
            console.log("Updated Details:", updatedDetails);
            await db.detailStore!.updateDetailsById(detailsId, updatedDetails!);
            
            await db.placemarkStore!.updatePlacemarkById(placemarkId, { title: updatedDetails!.title });
            return h.redirect("/dashboard/placemark/" + placemarkId);
        }
    }
};
