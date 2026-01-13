import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Cookie from "@hapi/cookie";
import Bell from "@hapi/bell";
import Joi from "joi";
import Inert from "@hapi/inert";
import HapiSwagger from "hapi-swagger";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { apiRoutes } from "./api-routes.js";


import { accountsController } from "./controllers/accounts-controller.js";



const swaggerOptions = {
  info: {
    title: "SailingPlacemark API",
    version: "0.1",
  },
};


const dirname = process.cwd();

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  // process.exit(1);
}

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 10000,
        host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost"
    });

    await server.register(Vision);
    await server.register(Cookie);
    await server.register(Inert);
    await server.register(Bell);

      await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  
    server.validator(Joi);

    server.auth.strategy("session", "cookie", {
      cookie: {
        name: process.env.COOKIE_NAME,
        password: process.env.COOKIE_PASSWORD,
        isSecure: process.env.NODE_ENV === "production",
      },
      redirectTo: "/",
      validate: accountsController.validate,
    });

    const bellAuthOptions = {
        password: "cookie_encryption_password_secure",
        isSecure: process.env.NODE_ENV === "production",  
        location: process.env.RENDER_EXTERNAL_URL || "http://localhost:3000"
    };

    server.auth.strategy("github", "bell", {
        provider: "github",
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        ...bellAuthOptions,
    });

    server.auth.strategy("google", "bell", {
        provider: "google",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        ...bellAuthOptions,
    });

    server.auth.default("session");

    Handlebars.registerHelper("json", (context) => 
         (JSON.stringify(context))
    );
    Handlebars.registerHelper("eq", (a, b) => a === b);

    server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });
    const storeType = (process.env.STORE_TYPE ?? "mongo") as "mongo" | "json";
    await db.init(storeType);

    try {
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminUsername && adminEmail && adminPassword) {
        const existing = await db.userStore!.getUserByEmail(adminEmail);
        if (!existing) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(adminPassword, salt);
          await db.userStore!.addUser({
            username: adminUsername,
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true,
          });
        }
      }
    } catch (err) {
      console.log("Admin bootstrap error", err);
    }

    server.route(webRoutes);
    server.route(apiRoutes as Hapi.ServerRoute[]);
    await server.start();
    console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {

    console.log(err);
    process.exit(1);
});

init();
