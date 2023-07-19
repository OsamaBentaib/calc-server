import { Socket } from "socket.io";
import { handleCalculationEvent } from "./calculator.controller";
import * as SERVICE from "./calculator.service";
import { CalculationResponse, CommandResponse } from "../../../types/types";
import { ObjectId } from "mongodb";
import { calculationResponseData } from "../../../test/testData";

jest.mock("./calculator.service");

describe("calculator controller", () => {
  it("should calculate the result for a valid operation", async () => {
    const mockResult = {
      message: "1+1",
      data: [calculationResponseData[0]],
    };
    const emit = jest.fn();
    const on = jest.fn();

    jest
      .spyOn(SERVICE, "performCalculation")
      .mockResolvedValue(mockResult as unknown as CommandResponse);

    const socket = {
      on,
      emit,
    };

    handleCalculationEvent(socket as unknown as Socket);

    const messageEventHandler = on.mock.calls[0][1];

    await messageEventHandler("1 + 1");

    expect(SERVICE.performCalculation).toHaveBeenCalledWith("1 + 1");

    expect(emit).toHaveBeenCalledWith("calculations", mockResult);
  });

  it("should return the calculation history for 'history' command", async () => {
    const mockResult = {
      message: "history",
      data: calculationResponseData,
    };
    const emit = jest.fn();
    const on = jest.fn();

    jest
      .spyOn(SERVICE, "lastCalculations")
      .mockResolvedValue(mockResult as unknown as CommandResponse);

    const socket = {
      on,
      emit,
    };

    handleCalculationEvent(socket as unknown as Socket);

    const messageEventHandler = on.mock.calls[0][1];

    await messageEventHandler("history");

    expect(SERVICE.lastCalculations).toHaveBeenCalled();

    expect(emit).toHaveBeenCalledWith("calculations", mockResult);
  });

  it("should emit an error for an unknown command", async () => {
    const emit = jest.fn();
    const on = jest.fn();

    const socket = {
      on,
      emit,
    };

    handleCalculationEvent(socket as unknown as Socket);

    const messageEventHandler = on.mock.calls[0][1];

    await messageEventHandler("unknown command");

    expect(emit).toHaveBeenCalledWith("error", {
      message: "unknown command",
      error:
        "Invalid command. Please use operation commands (e.g., 1 + 1, 5 * 3) or the history command.",
    });
  });
});
