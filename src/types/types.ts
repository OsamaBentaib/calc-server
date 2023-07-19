import { ObjectId } from "mongodb";


export interface CalculationResponse {
  _id: ObjectId;
  calculation: string;
  result: number;
  date: Date;
}
export interface CommandResponse {
  message: string;
  data: CalculationResponse[];
}

export interface CommandErrorException {
  message: string;
  error: string;
}
