import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Logging";
import authorRoutes from "./routes/Authors";
import bookRoutes from "./routes/Book";

const router = express();

// connect to mongoose
mongoose
  .connect(config.mongo.url)
  .then(() => {
    Logging.info("connected to database");
    StartServer();
    Logging.info("gesrg");
  })
  .catch((error) => {
    Logging.error("unable to connect");
    Logging.error(error);
  });

// only start the server if mongo connects
const StartServer = () => {
  router.use((req, res, next) => {
    // log the request
    Logging.info(
      `Incomming -> Method: [${req.method}] -url: [${req.url}] -IP: [${req.socket.remoteAddress}] `
    );

    res.on("finish", () => {
      // log the responce
      Logging.info(
        `Incomming -> Method: [${req.method}] -url: [${req.url}] -IP: [${req.socket.remoteAddress}] -Statuc:[${res.statusCode}]`
      );
    });
    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  // Rules of our API
  router.use((req, res, next) => {
    // these request comes from anywhere we can add ips and trusted sources here if we wanted to be private
    res.header("Access-Control-Allow-Origin", "*");

    // these headers are allowed to use inside project
    res.header(
      "Access-Control-Allow-Headers",
      "Origin X-Requested-with, Content-Type, Accept, Authorization"
    );
    if (req.method == "OPTIONS") {
      // methods which are allowed
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );

      return res.status(200).json({});
    }

    next();
  });

  // routes
  router.use("/author", authorRoutes);
  router.use("/book", bookRoutes);

  // Healthcheck
  router.get("/ping", (req, res, next) =>
    res.status(200).json({ message: "pong" })
  );

  // Error handeling
  router.use((req, res, next) => {
    const error = new Error("Route Not Found");
    Logging.error(error);
    return res.status(404).json({ message: error.message });
  });

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`server is running on port${config.server.port}-`)
    );
};
