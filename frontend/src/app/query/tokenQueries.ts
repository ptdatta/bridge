import axios, { AxiosResponse } from "axios";
import { SERVER_URL } from "../constants/constant";

const fetchTokens = async (
  page: number,
  limit: number,
  search?: string,
  chainid?: number
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${SERVER_URL}/tokens`,
      {
        params: {
          page,
          limit,
          search,
          chainid,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch tokens");
  }
};

const fetchQuote = async (
  srcChainId: number,
  srcQuoteTokenAddress: string,
  srcQuoteTokenAmount: string,
  dstChainId: number,
  dstQuoteTokenAddress: string,
  slippage: number
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${SERVER_URL}/quotes`,
      {},
      {
        params: {
          srcChainId,
          srcQuoteTokenAddress,
          srcQuoteTokenAmount,
          dstChainId,
          dstQuoteTokenAddress,
          slippage,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data; 
  } catch (error) {
    throw new Error("Failed to fetch quote: " + error);
  }
};

const fetchTransactionParams = async (
  srcChainId: number,
  srcQuoteTokenAddress: string,
  srcQuoteTokenAmount: string,
  dstChainId: number,
  dstQuoteTokenAddress: string,
  slippage: number,
  receiver: string,
  bridgeProvider: string | undefined,
  srcBridgeTokenAddress: string | undefined,
  dstBridgeTokenAddress: string | undefined,
  srcSwapProvider: string | undefined,
  dstSwapProvider: string | undefined
): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${SERVER_URL}/params`,
      {},
      {
        params: {
          srcChainId,
          srcQuoteTokenAddress,
          srcQuoteTokenAmount,
          dstChainId,
          dstQuoteTokenAddress,
          slippage,
          receiver,
          bridgeProvider,
          srcBridgeTokenAddress,
          dstBridgeTokenAddress,
          srcSwapProvider,
          dstSwapProvider,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data; 
  } catch (error) {
    throw new Error("Failed to fetch transaction parameters");
  }
};


export { fetchQuote, fetchTokens, fetchTransactionParams };
