import {
  CalculationResponse,
  CommandErrorException,
  CommandResponse,
} from "./types";

export interface ServerToClientEvents {
  calculations: (response: CommandResponse) => void;
  error: (exeption: CommandErrorException) => void;
}

export interface ClientToServerEvents {
  message: (message: string) => void;
}
