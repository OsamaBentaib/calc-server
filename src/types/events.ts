import { CalculationResponse } from "./types";

export interface ServerToClientEvents {
  result: (result: CalculationResponse) => void;
  calculations: (calculations: CalculationResponse[]) => void;
  error: (errorMessage: string) => void;
}

export interface ClientToServerEvents {
  message: (calculation: string) => void;
}
