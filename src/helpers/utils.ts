import { CommandErrorException } from "../types/types";

export const getErrorMessage = (err: unknown): string => {
  return err instanceof Error ? err.message : "An unknown error occurred";
};

export const getErrorException = (
  message: string,
  err: unknown
): CommandErrorException => {
  return {
    message: message,
    error: getErrorMessage(err),
  };
};

export const UNKNOWN_COMMAND =
  "Invalid command. Please use operation commands (e.g., 1 + 1, 5 * 3) or the history command.";
