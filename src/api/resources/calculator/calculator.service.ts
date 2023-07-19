import { evaluate } from "mathjs";
import logger from "../../../config/logger";
import Calculation from "./calculator.model";
import { CalculationResponse, CommandResponse } from "../../../types/types";

export const performCalculation = async (
  message: string
): Promise<CommandResponse> => {
  try {
    const adjustedCalculation = message
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/x/g, "*")
      .replace(/,/g, ".");

    const result = evaluate(adjustedCalculation);

    logger.info(`Performed calculation: ${message} = ${result}`);

    const newCalculation = new Calculation({ calculation: message, result });

    const savedCalculation = await newCalculation.save();

    logger.info(`Performed calculation: ${message} = ${result} has been saved`);

    return {
      message,
      data: [savedCalculation as CalculationResponse],
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(
        `Error performing calculation: ${message}: ${error.message}`
      );
      throw error;
    }
    throw new Error("An unknown error occurred while performing calculation");
  }
};

export const lastCalculations = async (
  message: string
): Promise<CommandResponse> => {
  try {
    const calculations = (await Calculation.find()
      .sort({ date: -1 })
      .limit(10)
      .exec()) as CalculationResponse[];

    return {
      message,
      data: calculations,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error fetching calculation`);

      throw error;
    }
    throw new Error("An unknown error occurred while fetching calculation");
  }
};
