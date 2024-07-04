export type Token = {
  address: string;
  symbol: string;
  name: string;
  chainId: number;
  decimals: number;
  logoURI: string;
};

export type TokenTableProps = {
  data: Token[];
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  selectToken: (token: Token) => void;
};

export type ConnectorProps = {
  connected: boolean;
};

export type TokenCardProps = {
  token: Token;
};


