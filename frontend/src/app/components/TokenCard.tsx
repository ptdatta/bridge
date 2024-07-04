import React, { useState } from 'react';
import { TokenCardProps } from "../types/types";
import Image from 'next/image'


const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token.address);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000); 
  };

  return (
    <div className="border rounded-lg p-4 w-72 shadow-lg bg-white">
      <div className="flex items-center mb-4">
        <Image src={token.logoURI} alt={token.symbol} height={40} width={40} className="mr-4" />
        <div>
          <h2 className="text-xl font-bold">{token.name} ({token.symbol})</h2>
          <p className="text-sm text-gray-500">Chain ID: {token.chainId}</p>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-2 flex items-center">
          <p className="flex-grow"><strong>Address:</strong></p>
          <button onClick={copyToClipboard} className="p-1 rounded-full">
            {copied ? (
              <Image src="/assets/check.svg" alt="Copied" height={20} width={20} />
            ) : (
              <Image src="/assets/clipboard.svg" alt="Copy" height={15} width={15} />
            )}
          </button>
        </div>
        <p className="text-gray-700 break-all mb-4">{token.address}</p>
        <div>
          <p><strong>Decimals:</strong> {token.decimals}</p>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
