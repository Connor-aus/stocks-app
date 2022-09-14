import React, { useState, useContext, useEffect, createContext } from "react";

const StocksContext = React.createContext();
export const useStocks = () => useContext(StocksContext);

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  useEffect(() => {
    (async () => {
      setState(await getNasdaq());
    })();
  }, []);

  return (
    <StocksContext.Provider
      value={{
        stocks: state,
        setStocks: setState,
      }}
    >
      {children}
    </StocksContext.Provider>
  );
};

async function getNasdaq() {
  const FMP_API_KEY = "e25ee6f07a20300466042dc2892848eb";
  const url = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${FMP_API_KEY}`;

  let res = await fetch(url);
  let stocks = await res.json();

  return stocks.map((stocks) => {
    return {
      symbol: stocks.symbol,
      name: stocks.name,
    };
  });
}
