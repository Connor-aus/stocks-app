import React, { useState, createContext, useContext } from "react";

const QuoteHistoryContext = createContext();
export const useQuoteHistory = () => useContext(QuoteHistoryContext);

export const QuoteHistoryProvider = ({ children }) => {
  const [quoteHistory, setQuoteHistory] = useState([]);

  return (
    <QuoteHistoryContext.Provider
      value={{
        quoteHistory: quoteHistory,
        setQuoteHistory: setQuoteHistory,
        addQuoteHistory: async (x) =>
          await addQuoteHistory(x, quoteHistory, setQuoteHistory),
      }}
    >
      {children}
    </QuoteHistoryContext.Provider>
  );
};

// add stock history
async function addQuoteHistory(stock, state, setState) {
  // check to see if quote history already exists
  let exists = false;
  try {
    state.map((x) => {
      if (x !== null && x["Meta Data"]["2. Symbol"] === stock) exists = true;
    });
  } catch {}

  // quote already exists
  if (exists) {
    return;
  }
  let quoteHistory = await getQuoteHistory(stock);
  setState((x) => {
    x.push(quoteHistory);

    return [...x];
  });
}

async function getQuoteHistory(stock) {
  const AA_API_KEY = "NHGS3IDIQ0OIJCEX";
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${AA_API_KEY}`;

  try {
    let res = await fetch(url);
    let data = await res.json();

    return data;
  } catch (error) {
    console.log(`Failed to retrieve quote history data for ${stock}: ${Error}`);
  }
}
