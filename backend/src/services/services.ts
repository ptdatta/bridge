import axios from "axios";
import { XY_FINANCE_API_URL } from "../constants/contants";

const fetchTokens = async (page: number, limit: number, search: string, chainid: number) => {
  const response = await axios.get(`${XY_FINANCE_API_URL}/recommendedTokens`);
  const tokens = response.data.recommendedTokens;

  const availableChainIds = [...new Set(tokens.map((token: any) => token.chainId))];
  const filteredTokens = tokens.filter(
    (token: any) =>
      (token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase())) &&
      token.chainId === chainid
  );
  const totalSize = filteredTokens.length;
  const paginatedTokens = filteredTokens.slice(
    (page - 1) * limit,
    page * limit
  );
  return {
    totalSize,
    availableChainIds,
    tokens: paginatedTokens,
  };
};

const fetchQuote = async (
  srcChainId: number,
  srcQuoteTokenAddress: string,
  srcQuoteTokenAmount: string,
  dstChainId: number,
  dstQuoteTokenAddress: string,
  slippage: number
) => {
  const amountInt = parseFloat(srcQuoteTokenAmount);
  if (isNaN(amountInt) || !Number.isInteger(amountInt)) {
    return {
      success: false,
      message: 'Amount must be an integer.'
    };
  }
  const response = await axios.get(`${XY_FINANCE_API_URL}/quote`, {
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
  });
  return response.data;
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
) => {
  const params: { [key: string]: any } = {
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
  };

  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === undefined) {
      delete params[key];
    }
  });

  const queryString = new URLSearchParams(params).toString();

  const response = await axios.get(`${XY_FINANCE_API_URL}/buildTx?${queryString}`, {
    headers: {
      Accept: "application/json",
    },
  });

  return response.data;
};


export { fetchTokens, fetchQuote, fetchTransactionParams };
