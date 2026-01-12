import {ServerRoute} from "@hapi/hapi";

import { dashboardController } from "./controllers/dashboard-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { adminController } from "./controllers/admin-controller.js";

export const webRoutes:ServerRoute[] = [
  { method: "GET", path: "/", options: accountsController.index },
  { method: "GET", path: "/signup", options: accountsController.showSignup },
  { method: "GET", path: "/login", options: accountsController.showLogin },
  { method: "GET", path: "/logout", options: accountsController.logout },
  { method: "POST", path: "/register", options: accountsController.signup },
  { method: "POST", path: "/authenticate", options: accountsController.login },
  { method: "GET", path: "/dashboard/deleteplacemark/{id}", options: dashboardController.deletePlacemark },
  { method: "GET", path: "/dashboard/placemark/{id}", options: dashboardController.showPlacemarkDetails },
  { method: "POST", path: "/dashboard/placemark/{id}/comment", options: dashboardController.addComment },
  { method: "GET", path: "/dashboard/edit/{id}", options: dashboardController.showEditPlacemarkDetails },
  { method: "POST", path: "/dashboard/updateplacemark/{id}", options: dashboardController.updatePlacemarkDetails },

  { method: "GET", path: "/dashboard", options: dashboardController.index },
  { method: "POST", path: "/dashboard/addplacemark", options: dashboardController.addPlacemark },

  { method: "GET", path: "/admin", options: adminController.index },
  { method: "GET", path: "/admin/deleteuser/{id}", options: adminController.deleteUser },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }

];
