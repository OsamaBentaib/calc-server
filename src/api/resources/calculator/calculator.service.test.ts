import { lastCalculations, performCalculation } from "./calculator.service";
import Calculation from "./calculator.model";
import { calculationResponseData } from "../../../test/testData";

jest.mock("./calculator.model");

describe("calculator service", () => {
  it("should perform and save a valid calculation", async () => {
    const mockCalculation = calculationResponseData[0];

    const mockResult = {
      message: "1+1",
      data: [mockCalculation],
    };

    const saveMock = jest.fn().mockResolvedValue(mockCalculation);

    const calculationMock = jest
      .fn()
      .mockImplementation(() => ({ save: saveMock }));

    (Calculation as any) = calculationMock;

    const result = await performCalculation(mockResult.message);

    expect(result).toEqual(mockResult);

    expect(calculationMock).toHaveBeenCalledWith({
      calculation: mockCalculation.calculation,
      result: mockCalculation.result,
    });
    expect(saveMock).toHaveBeenCalled();
  });

  it("should fetch the last 10 calculations", async () => {
    const mockCalculations = calculationResponseData;

    const mockResult = {
      message: "history",
      data: mockCalculations,
    };

    const findMock = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockCalculations),
        }),
      }),
    });
    (Calculation as any).find = findMock;

    const result = await lastCalculations(mockResult.message);

    expect(result).toEqual(mockResult);
    expect(findMock).toHaveBeenCalled();
  });
});
