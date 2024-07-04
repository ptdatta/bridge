import React, { useState, useEffect, useCallback } from 'react';
import { TokenTableProps } from "../types/types";

const TokenTable: React.FC<TokenTableProps> = ({ data, page, rowsPerPage, total, onPageChange, onRowsPerPageChange,selectToken }) => {
  const headers = [
    { label: "Logo", key: "logo" },
    { label: "Symbol", key: "symbol" },
    { label: "Name", key: "name" },
    { label: "Chain ID", key: "chainId" },
    { label: "Decimals", key: "decimals" },
    { label: "Address", key: "address" }
  ];

  const totalPages = Math.ceil(total / rowsPerPage);

  const handleChangePage = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <div>
      <table className="min-w-full bg-[#1e2023] border border-gray-600">
        <thead>
          <tr className="bg-[#2a2f36] border-gray-600 border-b">
            {headers.map((header) => (
              <th key={header.key} className="px-4 py-2 text-left text-white">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((token) => (
            <tr key={token.address} onClick={()=>selectToken(token)} className='border-gray-600 text-white border-b cursor-pointer hover:bg-white hover:text-black'>
              <td className="px-4 py-2">
                <img src={token.logoURI} alt={token.symbol} className="w-8 h-8" />
              </td>
              <td className="px-4 py-2">{token.symbol}</td>
              <td className="px-4 py-2">{token.name}</td>
              <td className="px-4 py-2">{token.chainId}</td>
              <td className="px-4 py-2">{token.decimals}</td>
              <td className="px-4 py-2">{token.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <div>
          <label htmlFor="rowsPerPage" className="mr-2 text-white">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="bg-[#1e2023] text-white focus:outline-none rounded-md px-2 py-1"
          >
            <option value={20}>20</option>
            <option value={35}>35</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 mr-2 bg-white text-gray-600 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-white text-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenTable;
