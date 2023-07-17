import mongoose from "mongoose";

const calculationSchema = new mongoose.Schema({
  calculation: {
    type: String,
    required: true,
  },
  result: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const Calculation = mongoose.model("Calculation", calculationSchema);

export default Calculation;
