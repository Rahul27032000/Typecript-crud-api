"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const Logging_1 = __importDefault(require("./library/Logging"));
const Authors_1 = __importDefault(require("./routes/Authors"));
const Book_1 = __importDefault(require("./routes/Book"));
const router = (0, express_1.default)();
// connect to mongoose
mongoose_1.default
    .connect(config_1.config.mongo.url)
    .then(() => {
    Logging_1.default.info("connected to database");
    StartServer();
    Logging_1.default.info("gesrg");
})
    .catch((error) => {
    Logging_1.default.error("unable to connect");
    Logging_1.default.error(error);
});
// only start the server if mongo connects
const StartServer = () => {
    router.use((req, res, next) => {
        // log the request
        Logging_1.default.info(`Incomming -> Method: [${req.method}] -url: [${req.url}] -IP: [${req.socket.remoteAddress}] `);
        res.on("finish", () => {
            // log the responce
            Logging_1.default.info(`Incomming -> Method: [${req.method}] -url: [${req.url}] -IP: [${req.socket.remoteAddress}] -Statuc:[${res.statusCode}]`);
        });
        next();
    });
    router.use(express_1.default.urlencoded({ extended: true }));
    router.use(express_1.default.json());
    // Rules of our API
    router.use((req, res, next) => {
        // these request comes from anywhere we can add ips and trusted sources here if we wanted to be private
        res.header("Access-Control-Allow-Origin", "*");
        // these headers are allowed to use inside project
        res.header("Access-Control-Allow-Headers", "Origin X-Requested-with, Content-Type, Accept, Authorization");
        if (req.method == "OPTIONS") {
            // methods which are allowed
            res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }
        next();
    });
    // routes
    router.use("/author", Authors_1.default);
    router.use("/book", Book_1.default);
    // Healthcheck
    router.get("/ping", (req, res, next) => res.status(200).json({ message: "pong" }));
    // Error handeling
    router.use((req, res, next) => {
        const error = new Error("Route Not Found");
        Logging_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
    http_1.default
        .createServer(router)
        .listen(config_1.config.server.port, () => Logging_1.default.info(`server is running on port${config_1.config.server.port}-`));
};
