import Hapi from '@hapi/hapi';
import path from 'path';
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import dotenv from "dotenv";

import { webRoutes } from './web-routes.js';
import { db } from './models/db.js';


const dirname = process.cwd();

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(Vision);

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
    await db.init();
    server.route(webRoutes);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();