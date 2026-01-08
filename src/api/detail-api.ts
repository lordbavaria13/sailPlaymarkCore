import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { DetailApiArray, DetailApiSpec } from "../models/joi-schemas.js";
import { validationError } from "../models/logger.js";

interface DetailsProps {
	pmId: string;
	latitude: number;
	longitude: number;
	title: string;
	description: string;
	_id?: string;
}

export const detailApi = {
	find: {
		auth: false,
		handler: async function (_request: Request, _h: ResponseToolkit) {
			try {
				const details = await db.detailStore!.getAllDetails();
				return details;
			} catch (err) {
				return Boom.serverUnavailable(`Database Error ${err}`);
			}
		},
		tags: ["api"],
		description: "Get all details",
		notes: "Returns all details",
		response: { schema: DetailApiArray, failAction: validationError },
	},

	findOne: {
		auth: false,
		async handler(request: Request, _h: ResponseToolkit) {
			try {
				const details = await db.detailStore!.getDetailsById(request.params.id);
				if (!details) {
					return Boom.notFound("No Detail with this id");
				}
				return details;
			} catch (err) {
				return Boom.serverUnavailable("No Detail with this id");
			}
		},
		tags: ["api"],
		description: "Get a specific detail",
		notes: "Returns detail by id",
		response: { schema: DetailApiSpec, failAction: validationError },
	},

	create: {
		auth: false,
		handler: async function (request: Request, h: ResponseToolkit) {
			try {
				const details = request.payload;
				const newDetails = await db.detailStore!.addDetails(details as DetailsProps);
				if (newDetails) {
					return h.response(newDetails).code(201);
				}
				return Boom.badImplementation("error creating detail");
			} catch (err) {
				return Boom.serverUnavailable("Database Error");
			}
		},
		tags: ["api"],
		description: "Create a detail",
		notes: "Returns the newly created detail",
		validate: { payload: DetailApiSpec, failAction: validationError },
		response: { schema: DetailApiSpec, failAction: validationError },
	},

	deleteAll: {
		auth: false,
		handler: async function (_request: Request, h: ResponseToolkit) {
			try {
				await db.detailStore!.deleteAllDetails();
				return h.response().code(204);
			} catch (err) {
				return Boom.serverUnavailable(`Database Error ${err}`);
			}
		},
		tags: ["api"],
		description: "Delete all details",
		notes: "Removes all details",
	},

	deleteOne: {
		auth: false,
		handler: async function (request: Request, h: ResponseToolkit) {
			try {
				const details = await db.detailStore!.getDetailsById(request.params.id);
				if (!details) {
					return Boom.notFound("No Detail with this id");
				}
				await db.detailStore!.deleteDetailsById(details._id!);
				return h.response().code(204);
			} catch (err) {
				return Boom.serverUnavailable("No Detail with this id");
			}
		},
		tags: ["api"],
		description: "Delete a detail",
		notes: "Deletes the detail with the given id",
	},
};
