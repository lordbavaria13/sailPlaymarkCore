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
import * as jwt from "hapi-auth-jwt2";
import { validate } from "./models/jwt-utils.js";
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
        port: process.env.PORT || 3000,
        host: "localhost"
    });

    await server.register(Vision);
    await server.register(Cookie);
    await server.register(Inert);
    await server.register(Bell);
    await server.register(jwt);

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
        isSecure: false,
        isSameSite: "Lax",
        path: "/",           
        ttl: 24 * 60 * 60 * 1000, 
      },
      redirectTo: "/",
      validate: accountsController.validate,
    });

    server.auth.strategy("github", "bell", {
      provider: "github",
      password: "cookie_encryption_password_secure",
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      isSecure: false,
      scope: ["user:email"],
    });

    server.auth.strategy("google", "bell", {
      provider: "google",
      password: "cookie_encryption_password_secure",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      isSecure: false, 
    });

      server.auth.strategy("jwt", "jwt", {
    key: process.env.COOKIE_PASSWORD,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] }
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
