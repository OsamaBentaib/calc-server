import { Socket } from "socket.io";
import { lastCalculations, performCalculation } from "./calculator.service";
import logger from "../../../config/logger";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../types/events";
import { CalculationResponse as CalculationResponse } from "../../../types/types";
import { getErrorMessage } from "../../../helpers/utils";

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
        const result: CalculationResponse = await performCalculation(message);

        socket.emit("result", result);
        logger.info(`Calculation result for ${message} is ${result}`);
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        logger.error(`Error occurred during calculation: ${message}`);
        socket.emit("error", message);
      }
    } else if (message.trim().toLowerCase() === "history") {
      logger.info(`Received calculation history request`);

      try {
        const calculations: CalculationResponse[] = await lastCalculations();

        socket.emit("calculations", calculations);
        logger.info(`Calculations response is ${calculations}`);
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        logger.error(`Error occurred during fetching calculations: ${message}`);
        socket.emit("error", message);
      }
    } else {
      socket.emit(
        "error",
        "Invalid command. Please use operation commands (e.g., 1 + 1, 5 * 3) or the history command."
      );
    }
  });
};
