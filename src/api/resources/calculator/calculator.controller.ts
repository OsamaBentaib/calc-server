import { Socket } from "socket.io";
import { lastCalculations, performCalculation } from "./calculator.service";
import logger from "../../../config/logger";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../types/events";
import { CalculationResponse as CalculationResponse } from "../../../types/types";

const isCalculationRequest = (command: string) => {
  const calculationPattern = /^(\s*\d+\s*[\+\-\*\/]\s*)+\d+\s*$/;
  return calculationPattern.test(command);
};

export const handleCalculationEvent = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  socket.on("message", async (message: string) => {
    if (isCalculationRequest(message)) {
      logger.info(`Received calculation request: ${message}`);

      try {
        const result: CalculationResponse = await performCalculation(message);

        socket.emit("result", result);
        logger.info(`Calculation result for ${message} is ${result}`);
      } catch (err: unknown) {
        if (err instanceof Error) {
          socket.emit("error", err.message);
          logger.error(`Error occurred during calculation: ${err.message}`);
        } else {
          socket.emit("error", "An unknown error occurred");
          logger.error("An unknown error occurred during calculation");
        }
      }
    } else if (message.trim().toLowerCase() === "history") {
      logger.info(`Received calculation history request`);

      try {
        const calculations: CalculationResponse[] = await lastCalculations();

        socket.emit("calculations", calculations);
        logger.info(`Calculations response is ${calculations}`);
      } catch (err: unknown) {
        if (err instanceof Error) {
          socket.emit("error", err.message);
          logger.error(`Error occurred during calculation: ${err.message}`);
        } else {
          socket.emit("error", "An unknown error occurred");
          logger.error("An unknown error occurred during calculation");
        }
      }
    } else {
      socket.emit(
        "error",
        "Invalid command. Please use operation commands (e.g., 1 + 1, 5 * 3) or the history command."
      );
    }
  });
};
