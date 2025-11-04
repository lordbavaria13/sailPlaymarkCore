import {ServerRoute} from '@hapi/hapi';

import { dashboardController } from './controllers/dashboard-controller.js';
import { accountsController } from "./controllers/accounts-controller.js";

export const webRoutes:ServerRoute[] = [
  { method: "GET", path: "/", options: accountsController.index },
  { method: "GET", path: "/signup", options: accountsController.showSignup },
  { method: "GET", path: "/login", options: accountsController.showLogin },
  { method: "GET", path: "/logout", options: accountsController.logout },
  { method: "POST", path: "/register", options: accountsController.signup },
  { method: "POST", path: "/authenticate", options: accountsController.login },

  { method: "GET", path: "/dashboard", options: dashboardController.index },
  { method: "POST", path: "/dashboard/addplacemark", options: dashboardController.addPlacemark },
];
