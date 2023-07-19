import { Socket } from "socket.io";
import { lastCalculations, performCalculation } from "./calculator.service";
import logger from "../../../config/logger";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../types/events";
import {
  CalculationResponse as CalculationResponse,
  CommandResponse,
} from "../../../types/types";
import {
  UNKNOWN_COMMAND,
  getErrorException,
  getErrorMessage,
} from "../../../helpers/utils";

const isCalculationRequest = (command: string) => {
  const calculationPattern =
    /^(\s*\d+([.,]\d+)?\s*[\+\-\*\/]\s*)+\d+([.,]\d+)?\s*$/;
  return calculationPattern.test(command);
};

export const handleCalculationEvent = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  socket.on("message", async (message: string) => {
    if (isCalculationRequest(message)) {
      logger.info(`Received calculation request: ${message}`);

      try {
        const response: CommandResponse = await performCalculation(message);

        socket.emit("calculations", response);

        logger.info(`Calculation result for ${message} is ${response}`);
      } catch (err: unknown) {
        const exception = getErrorException(message, err);

        logger.error(`Error occurred during calculation: ${exception.error}`);

        socket.emit("error", exception);
      }
    } else if (message.trim().toLowerCase() === "history") {
      logger.info(`Received calculation history request`);

      try {
        const response: CommandResponse = await lastCalculations(message);

        socket.emit("calculations", response);

        logger.info(`Calculations response is ${response}`);
      } catch (err: unknown) {
        const exception = getErrorException(message, err);

        logger.error(
          `Error occurred during fetching calculations: ${exception.error}`
        );

        socket.emit("error", exception);
      }
    } else {
      socket.emit("error", {
        message,
        error: UNKNOWN_COMMAND,
      });
    }
  });
};
