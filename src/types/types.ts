import { ObjectId } from "mongodb";

export interface CalculationResponse {
  _id: ObjectId;
  calculation: string;
  result: number;
  date: Date;
}
