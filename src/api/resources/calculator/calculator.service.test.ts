import { lastCalculations, performCalculation } from "./calculator.service";
import Calculation from "./calculator.model";

jest.mock("./calculator.model");

describe("calculator service", () => {
  it("should perform and save a valid calculation", async () => {
    const mockCalculation = "1 + 1";
    const mockResult = { result: 2, calculation: "1 + 1", date: "", _id: "" };

    const saveMock = jest.fn().mockResolvedValue(mockResult);

    const calculationMock = jest
      .fn()
      .mockImplementation(() => ({ save: saveMock }));

    (Calculation as any) = calculationMock;

    const result = await performCalculation(mockCalculation);

    expect(result).toEqual(mockResult);

    expect(calculationMock).toHaveBeenCalledWith({
      calculation: mockCalculation,
      result: 2,
    });
    expect(saveMock).toHaveBeenCalled();
  });
  it("should fetch the last 10 calculations", async () => {
    const mockCalculations = [
      { result: 2, calculation: "1 + 1", date: "", _id: "" },
      { result: 3, calculation: "1 + 2", date: "", _id: "" },
    ];

    const findMock = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockCalculations),
        }),
      }),
    });
    (Calculation as any).find = findMock;

    const result = await lastCalculations();

    expect(result).toEqual(mockCalculations);
    expect(findMock).toHaveBeenCalled();
  });
});
