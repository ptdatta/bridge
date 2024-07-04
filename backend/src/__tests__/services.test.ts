// __tests__/services.test.ts
import axios from "axios";
import {
  fetchTokens,
  fetchQuote,
  fetchTransactionParams,
} from "../services/services";
import { XY_FINANCE_API_URL } from "../constants/contants";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchTokens", () => {
  it("should fetch tokens correctly", async () => {
    const mockTokens = [
      { id: 1, name: "Token A",symbol: "A",chainId: 1  },
      { id: 2, name: "Token B",symbol: "B",chainId: 1  },
    ];
    mockedAxios.get.mockResolvedValueOnce({
      data: { recommendedTokens: mockTokens },
    });

    const result = await fetchTokens(1, 10, "", 1);
    console.log('Result:', result); 
    expect(result.tokens).toEqual(mockTokens);
    expect(result.totalSize).toBe(2);
    expect(result.availableChainIds).toEqual([1]);
  });

  it("should filter tokens by search and chainId", async () => {
    const mockTokens = [
      { id: 1, name: "Bitcoin", symbol: "BTC", chainId: 1 },
      { id: 2, name: "Ethereum", symbol: "ETH", chainId: 2 },
    ];
    mockedAxios.get.mockResolvedValueOnce({
      data: { recommendedTokens: mockTokens },
    });

    const result = await fetchTokens(1, 10, "btc", 1);

    expect(result.tokens).toEqual([
      { id: 1, name: "Bitcoin", symbol: "BTC", chainId: 1 },
    ]);
    expect(result.totalSize).toBe(1);
    expect(result.availableChainIds).toEqual([1, 2]);
  });
});

describe("fetchQuote", () => {
  it("should fetch quote correctly", async () => {
    const mockQuote = { amount: "99.5" };
    mockedAxios.get.mockResolvedValueOnce({ data: mockQuote });

    const result = await fetchQuote(1, "0xabc...", "100", 2, "0xdef...", 0.1);

    expect(result).toEqual(mockQuote);
  });
});

describe("fetchTransactionParams", () => {
  it("should fetch transaction parameters correctly", async () => {
    const mockTransactionParams = { fee: "0.001" };
    mockedAxios.get.mockResolvedValueOnce({ data: mockTransactionParams });

    const result = await fetchTransactionParams(
      1,
      "0xabc...",
      "100",
      2,
      "0xdef...",
      0.1,
      "0xreceiver...",
      "bridgeProvider",
      "srcBridgeTokenAddress",
      "dstBridgeTokenAddress",
      "srcSwapProvider",
      "dstSwapProvider"
    );

    expect(result).toEqual(mockTransactionParams);
  });
});
