import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./mongoose";
import app from "./app";
import { performCalculation } from "./api/resources/calculator/calculator.service";
import { getErrorMessage } from "./helpers/utils";
import logger from "./config/logger";
import { handleCalculationEvent } from "./api/resources/calculator/calculator.controller";

const PORT = process.env.PORT || 3000;

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  handleCalculationEvent(socket);
});

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  logger.error(`Error: ${getErrorMessage(err)}`);
  server.close(() => process.exit(1));
});
