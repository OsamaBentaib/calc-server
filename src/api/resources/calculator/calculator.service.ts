import { evaluate } from "mathjs";
import logger from "../../../config/logger";
import Calculation from "./calculator.model";
import { CalculationResponse } from "../../../types/types";

export const performCalculation = async (
  calculation: string
): Promise<CalculationResponse> => {
  try {
    const adjustedCalculation = calculation
      .replace(/÷/g, "/")
      .replace(/×/g, " * ")
      .replace(/x/g, " * ");

    const result = evaluate(adjustedCalculation);

    logger.info(`Performed calculation: ${calculation} = ${result}`);
    const newCalculation = new Calculation({ calculation, result });

    await newCalculation.save();

    logger.info(
      `Performed calculation: ${calculation} = ${result} has been saved`
    );

    return newCalculation;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(
        `Error performing calculation: ${calculation}: ${error.message}`
      );

      throw error;
    }
    throw new Error("An unknown error occurred while performing calculation");
  }
};

export const lastCalculations = async () => {
  try {
    return await Calculation.find().sort({ date: -1 }).limit(10).exec();
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error fetching calculation`);

      throw error;
    }
    throw new Error("An unknown error occurred while fetching calculation");
  }
};
