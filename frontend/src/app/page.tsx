"use client";
import { useEffect, useState, useCallback } from "react";
import TokenTable from "./components/TokenTable";
import {
  fetchQuote,
  fetchTokens,
  fetchTransactionParams,
} from "./query/tokenQueries";
import { Token } from "./types/types";
import TokenCard from "./components/TokenCard";
import Connector from "./components/Connector";
import ReactJson from "react-json-view";
import Image from "next/image";

const jsonBoxStyle = {
  height: "100%",
  overflow: "auto",
  borderRadius: "8px",
  backgroundColor: "#1e2023",
  padding: "16px",
};

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [search, setSearch] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [chains, setChains] = useState<number[]>([]);
  const [currPage, setCurrPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [isSrct, setIsSrct] = useState<boolean>(true);
  const [srcToken, setSrcToken] = useState<Token>();
  const [dstToken, setDstToken] = useState<Token>();
  const [connect, setConnect] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [raccount, setRaccount] = useState<string>("");
  const [slippage, setSlippage] = useState<string>("");
  const [jsonData, setJsonData] = useState<object>();
  const [quote, setQuote] = useState<boolean>(true);
  const [tx, setTx] = useState<boolean>(true);
  const [res, setRes] = useState<String>("Awaiting for JSON responce...");

  const getData = useCallback(async () => {
    const data = await fetchTokens(currPage + 1, rowsPerPage, search, chainId);
    setTokens(data.tokens);
    setTotal(data.totalSize);
    setChains(data.availableChainIds);
  }, [currPage, rowsPerPage, search, chainId]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    const shouldConnect = () => {
      return srcToken != null && dstToken != null;
    };

    const shouldQuote = () => {
      return (
        srcToken != null && dstToken != null && amount !== "" && slippage !== ""
      );
    };

    const shouldTx = () => {
      return jsonData?.quote && jsonData?.quote.success && raccount !== "";
    };

    setConnect(shouldConnect());
    setQuote(!shouldQuote());
    setTx(!shouldTx());
  }, [srcToken, dstToken, amount, slippage, jsonData, raccount]);

  const handlePageChange = (newPage: number) => {
    setCurrPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrPage(0);
  };

  const getQuote = async () => {
    setRes("Fetching Quote.....");
    setJsonData(undefined);
    if (
      srcToken != null &&
      dstToken != null &&
      amount !== "" &&
      slippage !== ""
    ) {
      const data = await fetchQuote(
        srcToken?.chainId,
        srcToken?.address,
        amount,
        dstToken?.chainId,
        dstToken?.address,
        parseFloat(slippage)
      );
      setJsonData(data);
    }
  };

  const bridge = async () => {
    if (jsonData !== null && raccount !== undefined) {
      const srcChainId = jsonData?.quote.routes[0].srcChainId;
      const srcQuoteTokenAddress =
        jsonData?.quote.routes[0].srcQuoteTokenAddress;
      const srcQuoteTokenAmount = jsonData?.quote.routes[0].srcQuoteTokenAmount;
      const dstChainId = jsonData?.quote.routes[0].dstChainId;
      const dstQuoteTokenAddress =
        jsonData?.quote.routes[0].dstQuoteTokenAddress;
      const slippage = jsonData?.quote.routes[0].slippage;
      const receiver = raccount;
      let srcBridgeTokenAddress = srcToken?.address;
      let dstBridgeTokenAddress = dstToken?.address;
      let bridgeProvider = undefined;
      const srcSwapProvider =
        jsonData?.quote.routes[0].srcSwapDescription?.provider;
      const dstSwapProvider =
        jsonData?.quote.routes[0].dstSwapDescription?.provider;
      if (srcToken?.chainId !== dstToken?.chainId) {
        srcBridgeTokenAddress =
          jsonData?.quote.routes[0].bridgeDescription.srcBridgeTokenAddress;
        dstBridgeTokenAddress =
          jsonData?.quote.routes[0].bridgeDescription.dstBridgeTokenAddress;
        bridgeProvider = jsonData?.quote.routes[0].bridgeDescription.provider;
      }
      setJsonData(undefined);
      setRes("Building Tansaction....");
      const data = await fetchTransactionParams(
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
        dstSwapProvider
      );
      setJsonData(data);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrPage(0);
  };

  const handleChainIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value =
      event.target.value === "" ? undefined : parseInt(event.target.value, 10);
    setChainId(value);
    setCurrPage(0);
  };

  return (
    <div>
      <div className="flex flex-row">
        <div className="p-10 w-[25%]">
          <div className="flex flex-col items-center justify-center">
            <div className="w-96 h-80 relative bg-[#1e2023] rounded-xl flex justify-center items-center">
              {srcToken ? (
                <div>
                  <Image
                    onClick={() => setSrcToken(undefined)}
                    className="absolute top-2 right-2 cursor-pointer"
                    src="assets/delete.svg"
                    alt="delete"
                    width={15}
                    height={15}
                  />
                  <TokenCard token={srcToken} />
                </div>
              ) : (
                <p
                  onClick={() => setIsSrct(true)}
                  className="text-gray-500 cursor-pointer underline"
                >
                  {isSrct
                    ? "Source Token Selected"
                    : "Click here and Select the Source Token"}
                </p>
              )}
            </div>
            <Connector connected={connect} />
            <div className="w-96 h-80 relative bg-[#1e2023] rounded-xl flex justify-center items-center">
              {dstToken ? (
                <div>
                  <Image
                    onClick={() => setDstToken(undefined)}
                    className="absolute top-2 right-2 cursor-pointer"
                    src="assets/delete.svg"
                    alt="delete"
                    width={15}
                    height={15}
                  />
                  <TokenCard token={dstToken} />
                </div>
              ) : (
                <p
                  onClick={() => setIsSrct(false)}
                  className="text-gray-500 cursor-pointer underline"
                >
                  {isSrct
                    ? "Click here and Select the Destination Token"
                    : "Destination Token Selected"}
                </p>
              )}
            </div>
          </div>
          <div className="py-10 w-96 flex justify-center flex-col">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 mb-5 bg-[#1e2023] text-white placeholder-gray-500 rounded-md focus:outline-none "
            />
            <input
              type="number"
              placeholder="Set Slippage"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-full px-4 py-3 mb-5 bg-[#1e2023] text-white placeholder-gray-500 rounded-md focus:outline-none "
            />
            <button
              type="button"
              onClick={getQuote}
              disabled={quote}
              className="py-3 bg-white text-black font-semibold rounded-md focus:outline-none focus:ring-2 focus:white disabled:opacity-50"
            >
              Get Quote
            </button>
          </div>
        </div>

        <div className="p-10 w-[75%]">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search tokens..."
              value={search || ""}
              onChange={handleSearchChange}
              className="bg-[#1e2023] text-white placeholder-gray-500 rounded-md focus:outline-none px-4 py-2"
            />
            <select
              value={chainId || ""}
              onChange={handleChainIdChange}
              className="bg-[#1e2023] text-white focus:outline-none rounded-md px-4 py-2 ml-2"
            >
              <option value="">All Chains</option>
              {chains.map((id) => (
                <option key={id} value={id}>
                  Chain {id}
                </option>
              ))}
            </select>
          </div>
          <TokenTable
            data={tokens}
            page={currPage}
            rowsPerPage={rowsPerPage}
            total={total}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            selectToken={isSrct ? setSrcToken : setDstToken}
          />
        </div>
      </div>
      <div className="px-10">
        <div className="h-[700px]">
          {jsonData ? (
            <ReactJson
              src={jsonData}
              name={false}
              theme="google"
              displayDataTypes={false}
              indentWidth={4}
              style={jsonBoxStyle}
            />
          ) : (
            <div className="h-full w-full bg-[#1e2023] rounded-md flex justify-center items-center text-gray-500">
              {res}
            </div>
          )}
        </div>
        <div className="w-full my-8">
          <input
            type="text"
            placeholder="Enter Receiver Account"
            value={raccount}
            onChange={(e) => setRaccount(e.target.value)}
            className="w-full px-4 py-3 mb-5 bg-[#1e2023] text-white placeholder-gray-500 rounded-md focus:outline-none "
          />
          <button
            type="button"
            onClick={bridge}
            disabled={tx}
            className="py-3 w-full bg-white text-black font-semibold rounded-md focus:outline-none focus:ring-2 focus:white disabled:opacity-50"
          >
            Bridge
          </button>
        </div>
      </div>
    </div>
  );
}
