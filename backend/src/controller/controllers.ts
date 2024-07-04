import { Request, Response } from "express";
import {
  fetchTokens,
  fetchQuote,
  fetchTransactionParams,
} from "../services/services";

const getTokens = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = "", chainid = 1 } = req.query;
    const tokens = await fetchTokens(
      Number(page),
      Number(limit),
      String(search),
      Number(chainid)
    );
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tokens" });
  }
};

const getQuotes = async (req: Request, res: Response) => {
  try {
    const {
      srcChainId,
      srcQuoteTokenAddress,
      srcQuoteTokenAmount,
      dstChainId,
      dstQuoteTokenAddress,
      slippage,
    } = req.query;
    const quote = await fetchQuote(
      Number(srcChainId),
      String(srcQuoteTokenAddress),
      String(srcQuoteTokenAmount),
      Number(dstChainId),
      String(dstQuoteTokenAddress),
      Number(slippage)
    );

    res.json({ quote });
  } catch (error) {
    console.error("Error fetching quote:", error);
    res.status(500).json({ error: "Failed to fetch quote" });
  }
};

const getParams = async (req: Request, res: Response) => {
  try {
    const {
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
    } = req.query;

    const transactionParams = await fetchTransactionParams(
      Number(srcChainId),
      String(srcQuoteTokenAddress),
      String(srcQuoteTokenAmount),
      Number(dstChainId),
      String(dstQuoteTokenAddress),
      Number(slippage),
      String(receiver),
      bridgeProvider ? String(bridgeProvider) : undefined,
      srcBridgeTokenAddress ? String(srcBridgeTokenAddress) : undefined,
      dstBridgeTokenAddress ? String(dstBridgeTokenAddress) : undefined,
      srcSwapProvider ? String(srcSwapProvider) : undefined,
      dstSwapProvider ? String(dstSwapProvider) : undefined
    );

    res.json({ transactionParams });
  } catch (error) {
    console.error("Error fetching transaction parameters:", error);
    res.status(500).json({ error: "Failed to fetch transaction parameters" });
  }
};

export { getTokens, getQuotes, getParams };
