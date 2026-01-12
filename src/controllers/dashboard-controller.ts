import { Request, ResponseToolkit } from "@hapi/hapi";

import { v4 } from "uuid";
import { db } from "../models/db.js";
import { DetailsProps } from "../models/json/detail-json-store.js";
import { PlacemarkProps } from "../models/json/placemark-json-store.js";
import { DetailsSpec, PlacemarkSpec, CommentSpec } from "../models/joi-schemas.js";

async function getDashboardData(request: Request) {
    const loggedInUser = request.auth.credentials as { _id?: string };
    const userPlacemarks = await db.placemarkStore!.getUserPlacemarks(loggedInUser._id!) as PlacemarkProps[];
    const publicPlacemarks = await db.placemarkStore!.getPublicPlacemarks() as PlacemarkProps[];
    
    const allPlacemarks = [...userPlacemarks, ...publicPlacemarks];
    const uniquePlacemarks = Array.from(new Map(allPlacemarks.map(item => [item._id, item])).values());
    
    const placemarksWithDetails = await Promise.all(uniquePlacemarks.map(async (p) => {
        const detail = await db.detailStore!.getDetailByPmId(p._id!);
        return {
            ...p,
            latitude: detail?.latitude ?? 0,
            longitude: detail?.longitude ?? 0
        };
    }));

    return {
        title: "Sailing Dashboard",
        placemarks: placemarksWithDetails,
        user: loggedInUser,  
    };
}

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
            const viewData = await getDashboardData(request);
            return h.view("dashboard-view", viewData);
        },
    },

    addPlacemark: {
        validate: {
            payload: PlacemarkSpec,
            options: { abortEarly: false },
            failAction: async function (request:Request, h:ResponseToolkit, error?:Error) {
                const viewData = await getDashboardData(request);
                return h.view("dashboard-view", { ...viewData, title: "Add Placemark error", errors: error?.message }).takeover().code(400);
            },
        },
        handler: async function (request: Request, h: ResponseToolkit) {
            const payload = request.payload as { title?: string };
            const loggedInUser = request.auth.credentials as { _id?: string };
            if (!loggedInUser || !loggedInUser._id) {
                throw new Error("User not authenticated");
            }
            const newPlacemark = await db.placemarkStore!.addPlacemarks({
                title: payload.title ?? "",
                userId: loggedInUser._id!,
                category: "marina",
                images: [],
            });
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
            const loggedInUser = request.auth.credentials as { _id?: string; isAdmin?: boolean };
            const placemarkId = request.params.id;
            const placemark = (await db.placemarkStore!.getPlacemarkById(placemarkId)) as PlacemarkProps;   
            if (!placemark) {
                return h.redirect("/dashboard");
            }
            console.log("Placemark ID:", placemarkId);
            const details = await db.detailStore!.getDetailByPmId(placemarkId);
            const comments = await db.commentStore?.getCommentsByPlacemarkId(placemarkId) ?? [];
            const owner = await db.userStore!.getUserById(placemark.userId);
            console.log("Details:", details);
            return h.view("placemark-detail-view", { details: details, placemark: placemark, owner: owner, user: loggedInUser, comments: comments } );
        }
    },

    addComment: {
        validate: {
            payload: CommentSpec,
            options: { abortEarly: false },
            failAction: async function (request: Request, h: ResponseToolkit, error?: Error) {
                const loggedInUser = request.auth.credentials as { _id?: string };
                const placemarkId = request.params.id;
                const placemark = (await db.placemarkStore!.getPlacemarkById(placemarkId)) as PlacemarkProps;
                if (!placemark) return h.redirect("/dashboard");

                const details = await db.detailStore!.getDetailByPmId(placemarkId);
                const comments = await db.commentStore?.getCommentsByPlacemarkId(placemarkId) ?? [];
                const owner = await db.userStore!.getUserById(placemark.userId);
                
                return h.view("placemark-detail-view", {
                    title: "Error adding comment",
                    errors: error?.message,
                    details: details,
                    placemark: placemark,
                    owner: owner,
                    user: loggedInUser,
                    comments: comments
                }).takeover().code(400);
            },
        },
        handler: async function (request: Request, h: ResponseToolkit) {
            const loggedInUser = request.auth.credentials as { _id?: string };
            const placemarkId = request.params.id;
            const payload = request.payload as { text: string; rating: number };
            
            const user = await db.userStore!.getUserById(loggedInUser._id!);

            await db.commentStore!.addComment({
                placemarkId: placemarkId,
                userId: loggedInUser._id!,
                username: user?.username ?? "Unknown",
                text: payload.text,
                rating: Number(payload.rating),
                date: new Date()
            });
            return h.redirect(`/dashboard/placemark/${placemarkId}`);
        },
    },

        showEditPlacemarkDetails: {
        handler: async function(request: Request, h: ResponseToolkit) {
            const loggedInUser = request.auth.credentials as { _id?: string; isAdmin?: boolean };
            const detailsId = request.params.id;
            const details = await db.detailStore!.getDetailsById(detailsId);
            if (!details) {
                return h.view("edit-placemark-view", { details: null, user: loggedInUser });
            }
            const placemark = await db.placemarkStore!.getPlacemarkById(details.pmId);
            const category = placemark?.category ?? "marina";
            const images = placemark?.images ? placemark.images.join(", ") : "";
            return h.view("edit-placemark-view", { details: details, placemark: placemark, category, images, user: loggedInUser });
        }
    },
    updatePlacemarkDetails: {
    validate: {
      payload: DetailsSpec,
      options: { abortEarly: false },
            failAction: function (request:Request, h:ResponseToolkit, error?:Error) {
                return h.view("dashboard-view", { title: "Update Placemark Error", errors: error?.message }).takeover().code(400);
            },
    },
        handler: async function(request: Request, h: ResponseToolkit) {
            const placemarkId = request.params.id;
            const detailsId = await db.detailStore!.getDetailByPmId(placemarkId).then(detail => detail?._id) ?? "";
            const payload = request.payload as DetailsProps & { category?: string; images?: string };
            const updatedDetails: DetailsProps = {
                pmId: placemarkId,
                latitude: Number(payload.latitude),
                longitude: Number(payload.longitude),
                title: payload.title,
                description: payload.description ?? "",
                _id: detailsId || undefined,
            };
            
            const category = (payload.category ?? "").toLowerCase();
 
            const images = payload.images ? payload.images.split(",").map((s) => s.trim()).filter(Boolean) : [];

            console.log("Updated Details:", updatedDetails);
            await db.detailStore!.updateDetailsById(detailsId, updatedDetails);
            
            await db.placemarkStore!.updatePlacemarkById(placemarkId, { title: updatedDetails.title, category, images });
            return h.redirect(`/dashboard/placemark/${placemarkId}`);
        }
    }
};
